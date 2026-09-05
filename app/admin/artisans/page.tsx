import { createClient } from '@/lib/supabase/server'
import { reviewApplication } from '@/app/admin/actions'
import ConfirmButton from '@/app/admin/confirm-button'

type Application = {
  id: string
  user_id: string
  full_name: string
  phone: string
  cluster: string
  craft_type: string
  loom_count: number | null
  experience_years: number | null
  message: string | null
  status: 'pending' | 'approved' | 'rejected'
  reviewed_at: string | null
  created_at: string
}

const STATUS_PILL: Record<Application['status'], string> = {
  pending: 'adm-pill adm-pill-warn',
  approved: 'adm-pill adm-pill-ok',
  rejected: 'adm-pill adm-pill-mute',
}

function longDate(value: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default async function AdminArtisansPage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('artisan_applications')
    .select('*')
    .order('created_at', { ascending: false })

  const applications = (data ?? []) as Application[]
  const pending = applications.filter((a) => a.status === 'pending')
  const reviewed = applications.filter((a) => a.status !== 'pending')

  return (
    <>
      <div className="adm-head">
        <h1>
          Artisan applications <span className="adm-count">{applications.length}</span>
        </h1>
      </div>

      {error && <div className="msg msg-error">{error.message}</div>}

      <div className="adm-card">
        <h2>
          Pending <span className="adm-count">{pending.length}</span>
        </h2>

        {pending.length === 0 ? (
          <p className="adm-hint">Nothing left to review.</p>
        ) : (
          <div className="adm-apps">
            {pending.map((a) => (
              <article className="adm-app" key={a.id}>
                <header>
                  <span className="adm-strong">{a.full_name}</span>
                  <span className="adm-sub">
                    {a.cluster} · {a.craft_type}
                  </span>
                </header>

                <dl className="adm-app-facts">
                  <div>
                    <dt>Phone</dt>
                    <dd>{a.phone}</dd>
                  </div>
                  <div>
                    <dt>Looms</dt>
                    <dd>{a.loom_count ?? '—'}</dd>
                  </div>
                  <div>
                    <dt>Experience</dt>
                    <dd>
                      {a.experience_years != null
                        ? `${a.experience_years} year${a.experience_years === 1 ? '' : 's'}`
                        : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt>Applied</dt>
                    <dd>{longDate(a.created_at)}</dd>
                  </div>
                </dl>

                {a.message && <p className="adm-app-msg">{a.message}</p>}

                <footer>
                  {/* Approving sets the user's role to 'artisan' by
                      itself — that is sync_artisan_role() in
                      schema.sql, so there is nothing to do on the
                      Users page afterwards. */}
                  <form action={reviewApplication}>
                    <input type="hidden" name="application_id" value={a.id} />
                    <input type="hidden" name="status" value="approved" />
                    <ConfirmButton
                      className="adm-btn adm-btn-primary"
                      message={`Make ${a.full_name} an artisan partner?`}
                      pendingLabel="Working…"
                    >
                      Approve
                    </ConfirmButton>
                  </form>

                  <form action={reviewApplication}>
                    <input type="hidden" name="application_id" value={a.id} />
                    <input type="hidden" name="status" value="rejected" />
                    <ConfirmButton
                      className="adm-btn"
                      message={`Reject ${a.full_name}'s application?`}
                      pendingLabel="Working…"
                    >
                      Reject
                    </ConfirmButton>
                  </form>
                </footer>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="adm-card">
        <h2>
          Reviewed <span className="adm-count">{reviewed.length}</span>
        </h2>

        {reviewed.length === 0 ? (
          <p className="adm-hint">No applications have been reviewed yet.</p>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Cluster</th>
                <th>Craft</th>
                <th>Phone</th>
                <th>Reviewed</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reviewed.map((a) => (
                <tr key={a.id}>
                  <td className="adm-strong">{a.full_name}</td>
                  <td>{a.cluster}</td>
                  <td>{a.craft_type}</td>
                  <td>{a.phone}</td>
                  <td>{longDate(a.reviewed_at)}</td>
                  <td>
                    <span className={STATUS_PILL[a.status]}>{a.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
