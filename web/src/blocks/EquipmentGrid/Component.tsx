import configPromise from '@payload-config'
import { getPayload, type Where } from 'payload'
import React from 'react'

import type { EquipmentGridBlock as Props } from '@/payload-types'

import { equipmentCategories } from '@/collections/Equipment'
import { Icon } from '@/components/site/Icon'
import { Img } from '@/components/site/Img'
import { Section, SectionHead } from '@/components/site/Section'

import { FleetFilter } from './FleetFilter'

export const EquipmentGridBlock: React.FC<Props & { id?: string }> = async ({
  eyebrow,
  heading,
  lede,
  categories,
  showFilter,
  settings,
  id,
}) => {
  const payload = await getPayload({ config: configPromise })
  const where: Where = categories?.length ? { category: { in: categories } } : {}
  const { docs } = await payload.find({
    collection: 'equipment',
    where,
    sort: 'order',
    limit: 100,
    depth: 1,
    pagination: false,
  })
  if (!docs.length) return null

  const usedCats = equipmentCategories.filter((c) => docs.some((d) => d.category === c.value))
  const titleId = `fleet-${id ?? 'x'}`
  const listId = `fleet-list-${id ?? 'x'}`

  return (
    <Section labelledBy={heading ? titleId : undefined} settings={settings}>
      <div className="wrap">
        <SectionHead eyebrow={eyebrow} heading={heading} id={titleId} lede={lede} />
        {showFilter && usedCats.length > 1 ? (
          <FleetFilter categories={usedCats} listId={listId} />
        ) : null}
        <div className="fleet" id={listId}>
          {docs.map((u) => (
            <div className="unit reveal" data-cat={u.category} key={u.id}>
              {u.image ? (
                <div className="u-photo">
                  <Img media={u.image} sizes="(max-width: 600px) 92vw, 380px" />
                </div>
              ) : (
                <Icon name={u.icon || 'fleetExcavator'} />
              )}
              <h3>{u.name}</h3>
              {u.spec ? <div className="spec">{u.spec}</div> : null}
              {u.description ? <p>{u.description}</p> : null}
              {u.brand || u.model || u.quantity || u.specs?.length ? (
                <dl>
                  {u.brand || u.model ? (
                    <>
                      <dt>Make / model</dt>
                      <dd>{[u.brand, u.model].filter(Boolean).join(' ')}</dd>
                    </>
                  ) : null}
                  {u.quantity ? (
                    <>
                      <dt>In fleet</dt>
                      <dd>{u.quantity}</dd>
                    </>
                  ) : null}
                  {u.specs?.map((s) => (
                    <React.Fragment key={s.id ?? s.label}>
                      <dt>{s.label}</dt>
                      <dd>{s.value}</dd>
                    </React.Fragment>
                  ))}
                </dl>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
