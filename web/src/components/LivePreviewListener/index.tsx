'use client'
import dynamic from 'next/dynamic'
import React from 'react'

// Loaded only when a page renders it (draft preview), so regular visitors never
// download the live-preview client.
const Listener = dynamic(() => import('./Listener').then((m) => m.Listener), { ssr: false })

export const LivePreviewListener: React.FC = () => <Listener />
