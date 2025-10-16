"use client"

import React from "react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

type Comment = { author: string; text: string }

type Props = {
  eventId: string
  initial?: Comment[]
}

export function Comments({ eventId, initial = [] }: Props) {
  const storageKey = `comments:${eventId}`
  const [comments, setComments] = React.useState<Comment[]>(initial)
  const [author, setAuthor] = React.useState("")
  const [text, setText] = React.useState("")

  React.useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored) setComments(JSON.parse(stored) as Comment[])
  }, [storageKey])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    const next: Comment = { author: author.trim() || "Guest", text: text.trim() }
    const updated = [next, ...comments]
    setComments(updated)
    localStorage.setItem(storageKey, JSON.stringify(updated))
    setAuthor("")
    setText("")
  }

  return (
    <section aria-labelledby="comments-title" className="space-y-4">
      <h3 id="comments-title" className="text-xl font-medium">
        What people are saying
      </h3>
      <form onSubmit={submit} className="grid gap-2">
        <input
          aria-label="Your name"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-2"
        />
        <textarea
          aria-label="Your comment"
          placeholder="Share your thoughts..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-24 rounded-md border border-border bg-background px-3 py-2"
        />
        <div className="flex justify-end">
          <Button className="rounded-md bg-foreground text-background hover:opacity-90">Post comment</Button>
        </div>
      </form>
      <Separator className="my-4" />
      <ul className="grid gap-4">
        {comments.length === 0 ? (
          <li className="text-muted-foreground">No comments yet. Be the first.</li>
        ) : (
          comments.map((c, i) => (
            <li key={i} className="rounded-md border border-border p-4">
              <p className="text-sm text-muted-foreground">{c.author}</p>
              <p className="mt-1 leading-relaxed">{c.text}</p>
            </li>
          ))
        )}
      </ul>
    </section>
  )
}
