// src/pages/TestSupabase.tsx
import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type Note = {
  id: string
  created_at: string
  title: string
  content: string | null
}

export default function TestSupabase() {
  const [notes, setNotes] = useState<Note[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    async function loadNotes() {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) console.error('Select error:', error)
      else setNotes(data as Note[])
    }

    loadNotes()
  }, [])

  async function addNote(e: React.FormEvent) {
    e.preventDefault()
    const { data, error } = await supabase
      .from('notes')
      .insert([{ title, content }])
      .select('*')
      .single()

    if (error) {
      console.error('Insert error:', error)
      alert('Insert failed. Check console.')
      return
    }

    setNotes((prev) => [data as Note, ...prev])
    setTitle('')
    setContent('')
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">Supabase Notes — Test</h1>

      <form onSubmit={addNote} className="space-y-2">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full border rounded px-3 py-2"
          placeholder="Content (optional)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
        <button className="w-full bg-black text-white rounded px-4 py-2">
          Add note
        </button>
      </form>

      <ul className="divide-y">
        {notes.map((n) => (
          <li key={n.id} className="py-3">
            <div className="font-medium">{n.title}</div>
            {n.content && (
              <div className="text-sm text-neutral-700">{n.content}</div>
            )}
            <div className="text-xs text-neutral-500">
              {new Date(n.created_at).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
