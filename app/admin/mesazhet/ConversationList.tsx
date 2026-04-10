'use client'

import { useState } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif'
const RED = '#DA291C'

export type Message = {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  njoftim_id: string | null
}

export type Conversation = {
  key: string
  user1Id: string
  user2Id: string
  user1Name: string
  user2Name: string
  lastMessage: string
  lastDate: string
  messageCount: number
  messages: Message[]
  njoftimId: string | null
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('de-DE', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

function fmtFull(d: string) {
  return new Date(d).toLocaleDateString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

export default function ConversationList({ conversations }: { conversations: Conversation[] }) {
  const [selected, setSelected] = useState<Conversation | null>(null)

  return (
    <>
      {/* Conversation table */}
      <div style={{
        background: '#fff', borderRadius: '16px', overflow: 'hidden',
        boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F5F5F7' }}>
              {['Von', 'An', 'Letzte Nachricht', 'Anzeige', 'Nachrichten', 'Datum'].map(h => (
                <th key={h} style={{
                  padding: '11px 14px', textAlign: 'left', fontSize: '11px',
                  fontWeight: '700', color: '#86868B', textTransform: 'uppercase',
                  letterSpacing: '0.5px', whiteSpace: 'nowrap', fontFamily: FONT,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {conversations.map(conv => (
              <tr
                key={conv.key}
                onClick={() => setSelected(conv)}
                style={{
                  borderTop: '1px solid rgba(0,0,0,0.05)',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F9F9FB')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '12px 14px', fontSize: '13px', color: '#1D1D1F', fontWeight: '600', whiteSpace: 'nowrap', fontFamily: FONT }}>
                  {conv.user1Name}
                </td>
                <td style={{ padding: '12px 14px', fontSize: '13px', color: '#1D1D1F', whiteSpace: 'nowrap', fontFamily: FONT }}>
                  {conv.user2Name}
                </td>
                <td style={{ padding: '12px 14px', maxWidth: '320px', fontFamily: FONT }}>
                  <div style={{ fontSize: '12px', color: '#6E6E73', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {conv.lastMessage}
                  </div>
                </td>
                <td style={{ padding: '12px 14px', fontFamily: FONT }} onClick={e => e.stopPropagation()}>
                  {conv.njoftimId ? (
                    <a
                      href={`/njoftim/${conv.njoftimId}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '11px', color: RED, fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap' }}
                    >
                      Anzeige →
                    </a>
                  ) : (
                    <span style={{ fontSize: '11px', color: '#86868B' }}>—</span>
                  )}
                </td>
                <td style={{ padding: '12px 14px', fontFamily: FONT }}>
                  <span style={{
                    background: '#F5F5F7', borderRadius: '6px', padding: '3px 8px',
                    fontSize: '11px', fontWeight: '700', color: '#1D1D1F',
                  }}>
                    {conv.messageCount}
                  </span>
                </td>
                <td style={{ padding: '12px 14px', fontSize: '11px', color: '#86868B', whiteSpace: 'nowrap', fontFamily: FONT }}>
                  {fmt(conv.lastDate)}
                </td>
              </tr>
            ))}
            {conversations.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', fontSize: '14px', color: '#86868B', fontFamily: FONT }}>
                  Keine Konversationen gefunden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONT,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '600px',
              maxHeight: '80vh', display: 'flex', flexDirection: 'column',
              margin: '0 20px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}
          >
            {/* Modal header */}
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.07)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
            }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#1D1D1F' }}>
                  {selected.user1Name} ↔ {selected.user2Name}
                </div>
                <div style={{ fontSize: '12px', color: '#86868B', marginTop: '2px' }}>
                  {selected.messageCount} Nachrichten
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{
                  background: '#F5F5F7', border: 'none', borderRadius: '8px',
                  width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div style={{ overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selected.messages.map(msg => {
                const isUser1 = msg.sender_id === selected.user1Id
                const senderName = isUser1 ? selected.user1Name : selected.user2Name
                return (
                  <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isUser1 ? 'flex-start' : 'flex-end' }}>
                    <div style={{ fontSize: '10px', color: '#86868B', marginBottom: '3px', fontWeight: '600' }}>
                      {senderName}
                    </div>
                    <div style={{
                      background: isUser1 ? '#F5F5F7' : '#FFF0F0',
                      borderRadius: isUser1 ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                      padding: '9px 13px', maxWidth: '80%',
                    }}>
                      <div style={{ fontSize: '13px', color: '#1D1D1F', lineHeight: '1.5', wordBreak: 'break-word' }}>
                        {msg.content}
                      </div>
                      {msg.njoftim_id && (
                        <a href={`/njoftim/${msg.njoftim_id}`} target="_blank" rel="noreferrer" style={{
                          display: 'block', marginTop: '4px', fontSize: '10px', color: RED,
                          fontWeight: '600', textDecoration: 'none',
                        }}>
                          Anzeige →
                        </a>
                      )}
                    </div>
                    <div style={{ fontSize: '10px', color: '#86868B', marginTop: '3px' }}>
                      {fmtFull(msg.created_at)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
