/**
 * Estimates for the open-model finder (models.html): how much memory a model
 * needs at a given quantization, whether it fits a given machine, and roughly
 * how many tokens per second one conversation gets there.
 *
 * The numbers are rules of thumb, not measurements:
 *
 *   memory  = parameters × bits per weight ÷ 8, plus 10 % and 1.5 GB for the
 *             runtime and a context of a few thousand tokens.
 *   speed   = memory bandwidth ÷ bytes read per token × efficiency. Generating
 *             one token reads every active weight once, so the memory
 *             bandwidth of the machine bounds the speed; the efficiency factor
 *             (what real runtimes reach of that bound) is fitted to published
 *             llama.cpp, MLX and vLLM single-stream results. A
 *             mixture-of-experts model reads only its active parameters.
 *
 * Runs in the browser (window.ModelFinder) and in Node (the tests and
 * scripts/open-models.js require it).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ModelFinder = factory();
})(typeof self === 'undefined' ? this : self, function () {
  'use strict';

  /** Share of the weights added for the runtime's buffers and a short context. */
  const OVERHEAD_FACTOR = 1.1;
  /** Fixed overhead in GB (runtime, a context of a few thousand tokens). */
  const OVERHEAD_GB = 1.5;
  /** What a runtime reaches of the bandwidth bound, by kind of machine. */
  const EFFICIENCY = { gpu: 0.55, apple: 0.75, unified: 0.6, cpu: 0.6 };
  /** A mixture-of-experts model pays for routing and scattered memory access. */
  const MOE_FACTOR = 0.7;
  /** Splitting a model over several GPUs costs a little and does not add speed for one stream. */
  const MULTI_GPU_FACTOR = 0.9;
  /** Above this the estimate says nothing: small models are bound by compute, not memory. */
  const MAX_SPEED = 200;

  /** Bits per weight of the precision a model was released in (q2: a vendor's own 2-bit packing). */
  const NATIVE_BITS = { bf16: 16, fp16: 16, fp8: 8, fp4: 4.5, q2: 2.7 };

  function nativeBits(model) {
    return NATIVE_BITS[model.nativePrecision] || 16;
  }

  /**
   * Bits per weight a model really has at a quantization: never more than the
   * precision it was released in (an FP8 release has no 16-bit weights).
   */
  function effectiveBits(model, quantization) {
    return Math.min(quantization.bits, nativeBits(model));
  }

  /** Size of the weights in GB at a quantization. */
  function weightsGB(model, quantization) {
    return (model.paramsB * effectiveBits(model, quantization)) / 8;
  }

  /** Memory in GB a model needs at a quantization, with runtime and a short context. */
  function memoryGB(model, quantization) {
    return weightsGB(model, quantization) * OVERHEAD_FACTOR + OVERHEAD_GB;
  }

  /** Memory in GB a machine offers a model: all GPUs together, or the usable share of shared memory. */
  function usableMemoryGB(hardware, count) {
    return hardware.memoryGB * (hardware.kind === 'gpu' ? count || 1 : 1) * (hardware.usableShare || 1);
  }

  /** Tokens per second of one conversation, or null when the machine's bandwidth is unknown. */
  function tokensPerSecond(model, quantization, hardware, count) {
    if (!hardware.bandwidthGBs) return null;
    const activeB = model.architecture === 'moe' && model.activeParamsB ? model.activeParamsB : model.paramsB;
    const bytesPerTokenGB = (activeB * effectiveBits(model, quantization)) / 8;
    let speed = (hardware.bandwidthGBs / bytesPerTokenGB) * (EFFICIENCY[hardware.kind] || 0.5);
    if (model.architecture === 'moe' && model.activeParamsB) speed *= MOE_FACTOR;
    if (hardware.kind === 'gpu' && (count || 1) > 1) speed *= MULTI_GPU_FACTOR;
    return Math.min(speed, MAX_SPEED);
  }

  /**
   * The quantizations a model can be run at, best quality first: the precision
   * it was released in (id `native`), then every listed quantization below it.
   */
  function quantizationsFor(model, quantizations) {
    const native = nativeBits(model);
    const lower = quantizations.filter(q => q.bits < native).sort((a, b) => b.bits - a.bits);
    return [{ id: 'native', bits: native, precision: model.nativePrecision || 'bf16' }, ...lower];
  }

  /**
   * How a model runs on a machine: the best quantization that fits (not below
   * `minBits` bits per weight), the memory it takes and the speed. `fits` is false when not
   * even the smallest allowed quantization fits; the result then describes
   * that smallest one, so the page can say how much memory is missing.
   * Without hardware every model "fits" at its best allowed quantization.
   */
  function evaluate(model, options) {
    const { hardware, count = 1, quantizations, minBits = 0 } = options;
    // A model released below the wanted precision is still offered as released
    const floor = Math.min(minBits, nativeBits(model));
    const list = quantizationsFor(model, quantizations).filter(q => q.bits >= floor);
    if (!hardware) {
      const smallest = list[list.length - 1];
      return { fits: true, quantization: smallest, memoryGB: memoryGB(model, smallest), tokensPerSecond: null };
    }
    const available = usableMemoryGB(hardware, count);
    const chosen = list.find(q => memoryGB(model, q) <= available);
    const quantization = chosen || list[list.length - 1];
    return {
      fits: Boolean(chosen),
      quantization,
      memoryGB: memoryGB(model, quantization),
      availableGB: available,
      tokensPerSecond: tokensPerSecond(model, quantization, hardware, count)
    };
  }

  return {
    OVERHEAD_FACTOR,
    OVERHEAD_GB,
    MAX_SPEED,
    nativeBits,
    effectiveBits,
    weightsGB,
    memoryGB,
    usableMemoryGB,
    tokensPerSecond,
    quantizationsFor,
    evaluate
  };
});
