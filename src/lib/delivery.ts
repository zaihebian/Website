/**
 * Result contract for one delivery attempt to /api/behavior-events, extracted from
 * the tracker so the ok/failure decision can be unit-tested.
 *
 * `ok` mirrors the server's verdict on whether the payload was accepted (a lead
 * that reached no backend answers 503 / ok:false), so callers can tell "stored"
 * apart from "silently dropped" instead of assuming success.
 */
export type BehaviorDelivery = {
  ok: boolean;
  status: number;
  stored: boolean;
  error?: string;
};

export function readDelivery(response: Response): Promise<BehaviorDelivery> {
  return response
    .json()
    .catch(() => null)
    .then((payload: { ok?: boolean; stored?: boolean; error?: string } | null) => {
      const accepted = response.ok && payload?.ok !== false;
      return {
        ok: accepted,
        status: response.status,
        stored: Boolean(payload?.stored),
        error: accepted ? undefined : payload?.error ?? `HTTP ${response.status}`,
      };
    });
}
