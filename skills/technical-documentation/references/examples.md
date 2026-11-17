# Technical Documentation: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: API reference for one endpoint

**Request**

> Document our endpoint for creating a maintenance order. POST /api/v2/assets/{assetId}/maintenance-orders,
> needs scope `maintenance:write`. Body: `type` (required, one of inspection|repair|calibration), `dueDate`
> (required, ISO date), `priority` (optional, low|normal|high, default normal), `notes` (optional, max 2000 chars).
> Returns 201 with the order (id, assetId, type, status "planned", dueDate, priority, createdAt).
> Errors: 400 VALIDATION_ERROR, 404 ASSET_NOT_FOUND, 409 ORDER_CONFLICT if an open order of the same type exists.
> Base URL https://api.plantlink.example. Query param `notify` (bool, default false) emails the asset owner.

**How the skill handles it**

- Identifies the type as API reference and fills every section of that template: method, path, authentication,
  path/query/body parameters, response, errors, curl example.
- Code Examples rules: realistic fictional values (an asset ID, a calibration order) instead of "foo"; request and
  response both shown; the most common case (a calibration with notification) first.
- Cross-References rule: error codes copied exactly as given; a Note callout states the conflict rule, since that is
  the error callers hit most.

**Answer**

## Create Maintenance Order
**Method**: POST
**Path**: /api/v2/assets/{assetId}/maintenance-orders
**Description**: Creates a planned maintenance order (inspection, repair or calibration) for one asset.

### Authentication
Bearer token with the scope `maintenance:write`.

### Request Parameters
#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| assetId | string | Yes | Identifier of the asset the order is for |

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| notify | boolean | No | false | When `true`, emails the asset owner about the new order |

#### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | string | Yes | `inspection`, `repair` or `calibration` |
| dueDate | string (ISO 8601 date) | Yes | Date the work is due, for example `2026-12-04` |
| priority | string | No | `low`, `normal` or `high`; default `normal` |
| notes | string | No | Free text, at most 2,000 characters |

```json
{
  "type": "calibration",
  "dueDate": "2026-12-04",
  "priority": "high",
  "notes": "Torque sensor drifted 2.1% at last check."
}
```

### Response
**Status**: 201 Created

```json
{
  "id": "mo-58213",
  "assetId": "press-07",
  "type": "calibration",
  "status": "planned",
  "dueDate": "2026-12-04",
  "priority": "high",
  "createdAt": "2026-11-17T09:42:11Z"
}
```

New orders always start with the status `planned`.

### Error Responses
| Status | Code | Description |
|--------|------|-------------|
| 400 | VALIDATION_ERROR | A required field is missing, a value is outside its allowed set, or `notes` exceeds 2,000 characters |
| 404 | ASSET_NOT_FOUND | No asset exists with the given `assetId` |
| 409 | ORDER_CONFLICT | The asset already has an open order of the same `type` |

> **Note**: Only one open order per asset and type is allowed. Close or complete the existing order before creating
> a new one of the same type.

### Example
```bash
# Create a high-priority calibration order and notify the asset owner
curl -X POST "https://api.plantlink.example/api/v2/assets/press-07/maintenance-orders?notify=true" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type": "calibration", "dueDate": "2026-12-04", "priority": "high"}'
```

## Example 2: How-to with a contradiction in the notes

**Request**

> Write a guide for our service technicians: how do I connect the diagnostics tool "LineScope" to a filling line?
> Notes: laptop via LAN to port X2 of the controller, set laptop IP to static 192.168.10.50, open LineScope,
> "New connection", controller IP 192.168.10.1, port 8443. (A colleague says it has been port 443 since firmware
> 4.2.) Typical problems: certificate warning on first connect, "Connection timed out" when the IP is wrong.

**How the skill handles it**

- User Guide template: Overview, Prerequisites, numbered steps, expected outcome, troubleshooting, related topics.
- The notes conflict on the port. The skill does not pick one silently: the Maintenance Signals rule ("As of
  version ...") turns it into a version-specific step, and a Warning callout asks the team to confirm before
  publishing.
- Error messages are quoted exactly as the user wrote them.

**Answer**

# Connect LineScope to a filling line

> **Warning**: The port for firmware 4.2 and later (443 instead of 8443) is based on a colleague's report. Please
> confirm it on a line running firmware 4.2 before publishing this guide.

## Overview
This guide shows service technicians how to connect the LineScope diagnostics tool to the controller of a filling
line over LAN. Once connected, you can read the line's diagnostic data.

## Prerequisites
- Laptop with LineScope installed and a LAN port
- LAN cable
- Permission to change the laptop's IP address
- The controller's firmware version (on the type plate or in the operator panel under "Info")

## Step-by-step instructions
1. Connect the laptop to port `X2` of the controller with the LAN cable.
2. Set the laptop's IP address to the static value `192.168.10.50`.
3. Open LineScope and select **New connection**.
4. Enter `192.168.10.1` as the controller IP.
5. Enter the port that matches the firmware:
   - Firmware before 4.2: `8443`
   - As of firmware 4.2: `443`
6. Confirm the connection.

## Expected outcome
LineScope shows the connection as active and loads the line's diagnostic data.

## Troubleshooting
| Problem | Cause | Solution |
|---------|-------|----------|
| Certificate warning on first connect | The controller uses its own certificate | Accept the warning on first connect, provided IP and line are correct |
| "Connection timed out" | Wrong laptop or controller IP, or wrong port | Check the IPs from steps 2 and 4, then the port for the firmware version in step 5 |

> **Tip**: Check the firmware version before connecting. It avoids the most common failed attempt.

## Related topics
- Installing LineScope
- Exporting diagnostic data

*Last updated: 17 Nov 2026*
