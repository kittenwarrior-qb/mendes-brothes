import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import React from 'react'

import RichText from '@/components/RichText'
import { Section } from '@/components/site/Section'

import { SiteFormServer } from './SiteFormServer'

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: DefaultTypedEditorState
}

export const FormBlock: React.FC<{ id?: string } & FormBlockType> = ({
  enableIntro,
  form,
  introContent,
}) => {
  if (!form || typeof form !== 'object') return null
  return (
    <Section>
      <div className="wrap" style={{ maxWidth: 860 }}>
        {enableIntro && introContent ? (
          <RichText
            className="prose-site"
            data={introContent}
            enableGutter={false}
            enableProse={false}
          />
        ) : null}
        <div className="form" style={{ marginTop: 24 }}>
          <SiteFormServer form={form} />
        </div>
      </div>
    </Section>
  )
}
