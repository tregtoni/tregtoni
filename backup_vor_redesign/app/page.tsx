import { createClient } from '@/lib/supabase/server'
import NavBar from '@/app/components/NavBar'
import Footer from '@/app/components/Footer'
import { KATEGORITË, CATEGORY_ICON, QYTETET_SHQIPERI, QYTETET_KOSOVE } from '@/lib/kategori-data'

export default async function Home() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: njoftimet } = await supabase
    .from('njoftimet')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8)

  // Count per category for the grid
  const { data: counts } = await supabase
    .from('njoftimet')
    .select('category')

  const countPerCat: Record<string, number> = {}
  for (const row of counts ?? []) {
    countPerCat[row.category] = (countPerCat[row.category] ?? 0) + 1
  }

  return (
    <main>
      <NavBar />

      {/* Hero */}
      <section style={{background:'#fff',borderBottom:'3px solid #E24B4A',padding:'40px 24px',textAlign:'center'}}>
        <h1 style={{fontSize:'32px',fontWeight:'600',color:'#111',marginBottom:'8px'}}>
          Blini. Shitni. <span style={{color:'#E24B4A'}}>Tregtoni.</span>
        </h1>
        <p style={{color:'#666',fontSize:'14px',marginBottom:'24px'}}>Platforma nr.1 shqiptare për njoftime</p>

        <form action="/kerko" method="GET" style={{maxWidth:'860px',margin:'0 auto'}}>
          <div style={{display:'flex',border:'2px solid #ddd',borderRadius:'10px',overflow:'hidden',background:'#fff',boxShadow:'0 2px 12px rgba(0,0,0,0.07)'}}>
            {/* Search term */}
            <input
              name="q"
              type="text"
              placeholder="Çfarë po kërkon?"
              style={{flex:'1 1 0',border:'none',outline:'none',padding:'15px 14px',fontSize:'14px',color:'#111',backgroundColor:'#fff',minWidth:0}}
            />
            <div style={{width:'1px',background:'#eee',flexShrink:0,margin:'10px 0'}} />
            {/* Category */}
            <select
              name="kategoria"
              style={{flex:'0 0 auto',width:'158px',border:'none',outline:'none',padding:'15px 10px',fontSize:'13px',color:'#111',backgroundColor:'#fff',cursor:'pointer'}}
            >
              <option value="">Të gjitha kategoritë</option>
              {KATEGORITË.map(k => (
                <option key={k.slug} value={k.slug}>{k.icon} {k.shortName}</option>
              ))}
            </select>
            <div style={{width:'1px',background:'#eee',flexShrink:0,margin:'10px 0'}} />
            {/* City */}
            <select
              name="qyteti"
              style={{flex:'0 0 auto',width:'158px',border:'none',outline:'none',padding:'15px 10px',fontSize:'13px',color:'#111',backgroundColor:'#fff',cursor:'pointer'}}
            >
              <option value="">Të gjitha qytetet</option>
              <optgroup label="Shqipëri">
                {QYTETET_SHQIPERI.map(q => <option key={q} value={q}>{q}</option>)}
              </optgroup>
              <optgroup label="Kosovë">
                {QYTETET_KOSOVE.map(q => <option key={q} value={q}>{q}</option>)}
              </optgroup>
            </select>
            <div style={{width:'1px',background:'#eee',flexShrink:0,margin:'10px 0'}} />
            {/* Radius */}
            <select
              name="rrezja"
              style={{flex:'0 0 auto',width:'158px',border:'none',outline:'none',padding:'15px 10px',fontSize:'13px',color:'#111',backgroundColor:'#fff',cursor:'pointer'}}
            >
              <option value="">Gjithë Shqipërinë</option>
              <option value="5">5 km</option>
              <option value="10">10 km</option>
              <option value="25">25 km</option>
              <option value="50">50 km</option>
              <option value="100">100 km</option>
              <option value="200">200 km</option>
            </select>
            <button
              type="submit"
              style={{background:'#E24B4A',color:'#fff',border:'none',padding:'15px 24px',fontSize:'14px',fontWeight:'600',cursor:'pointer',flexShrink:0}}
            >
              Kërko
            </button>
          </div>
        </form>

        <div style={{display:'flex',gap:'8px',marginTop:'16px',justifyContent:'center',flexWrap:'wrap'}}>
          {['BMW','iPhone','Apartament','Laptop','Punë'].map(tag=>(
            <a key={tag} href={`/kerko?q=${encodeURIComponent(tag)}`} style={{background:'#f4f4f4',color:'#333',fontSize:'12px',padding:'5px 12px',borderRadius:'20px',border:'1px solid #ddd',cursor:'pointer',textDecoration:'none'}}>{tag}</a>
          ))}
        </div>
      </section>

      {/* Categories — all 14 */}
      <section style={{padding:'24px',background:'#fff'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
          <h2 style={{fontSize:'16px',fontWeight:'600',color:'#111',borderLeft:'3px solid #E24B4A',paddingLeft:'10px',margin:0}}>Kategoritë</h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:'10px'}}>
          {KATEGORITË.map(cat => (
            <a
              key={cat.slug}
              href={`/kategori/${cat.slug}`}
              style={{background:'#fff',border:'1px solid #eee',borderRadius:'10px',padding:'14px 6px',textAlign:'center',textDecoration:'none',display:'block'}}
            >
              <div style={{fontSize:'26px',marginBottom:'5px'}}>{cat.icon}</div>
              <div style={{fontSize:'11px',fontWeight:'500',color:'#111',lineHeight:'1.3'}}>{cat.shortName}</div>
              {countPerCat[cat.slug] ? (
                <div style={{fontSize:'10px',color:'#999',marginTop:'3px'}}>{countPerCat[cat.slug].toLocaleString('de-DE')}</div>
              ) : null}
            </a>
          ))}
        </div>
      </section>

      {/* Latest listings */}
      <section style={{padding:'24px',background:'#f9f9f9'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
          <h2 style={{fontSize:'16px',fontWeight:'600',color:'#111',borderLeft:'3px solid #E24B4A',paddingLeft:'10px',margin:0}}>Njoftimet e fundit</h2>
          <a href="/kerko" style={{color:'#E24B4A',fontSize:'13px',textDecoration:'none'}}>Shiko të gjitha →</a>
        </div>

        {njoftimet && njoftimet.length > 0 ? (
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px'}}>
            {njoftimet.map((ad) => (
              <div key={ad.id} style={{background:'#fff',border:'1px solid #eee',borderRadius:'10px',overflow:'hidden'}}>
                <a href={`/njoftim/${ad.id}`} style={{display:'block',textDecoration:'none'}}>
                  <div style={{height:'120px',background:'#f5f5f5',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'40px',position:'relative',overflow:'hidden'}}>
                    {ad.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ad.images[0]} alt={ad.title} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
                    ) : (
                      CATEGORY_ICON(ad.category)
                    )}
                    <span style={{position:'absolute',top:'8px',left:'8px',background:'#E24B4A',color:'#fff',fontSize:'10px',padding:'3px 7px',borderRadius:'4px'}}>I RI</span>
                  </div>
                  <div style={{padding:'10px 12px 6px'}}>
                    <div style={{fontSize:'15px',fontWeight:'600',color:'#111'}}>{ad.price.toLocaleString('de-DE')} €</div>
                    <div style={{fontSize:'12px',color:'#444',marginTop:'3px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{ad.title}</div>
                    <div style={{fontSize:'11px',color:'#999',marginTop:'4px'}}>📍 {ad.city}</div>
                  </div>
                </a>
                {user && user.id !== ad.user_id && (
                  <div style={{padding:'0 10px 10px'}}>
                    <a
                      href={`/mesazhet/${ad.user_id}?njoftim=${ad.id}`}
                      style={{display:'block',background:'#111',color:'#fff',textAlign:'center',padding:'6px 10px',borderRadius:'6px',fontSize:'12px',textDecoration:'none',fontWeight:'500'}}
                    >
                      💬 Dërgo mesazh
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{textAlign:'center',padding:'40px',color:'#999',fontSize:'14px'}}>
            Nuk ka njoftime aktualisht.{' '}
            <a href="/njoftim/shto" style={{color:'#E24B4A',textDecoration:'none'}}>Shto i pari!</a>
          </div>
        )}
      </section>

      {/* Stats */}
      <section style={{background:'#111',padding:'24px',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',textAlign:'center'}}>
        {[
          {num:'124',label:'Njoftime aktive'},
          {num:'89',label:'Përdorues'},
          {num:'3',label:'Shtete'},
        ].map(s=>(
          <div key={s.label}>
            <div style={{fontSize:'28px',fontWeight:'600',color:'#E24B4A'}}>{s.num}</div>
            <div style={{fontSize:'12px',color:'rgba(255,255,255,0.6)',marginTop:'4px'}}>{s.label}</div>
          </div>
        ))}
      </section>

      <section style={{padding:'24px',background:'#fff'}}>
        <a href="/njoftim/shto" style={{display:'block',background:'#E24B4A',color:'#fff',textAlign:'center',padding:'16px',fontSize:'16px',fontWeight:'500',borderRadius:'8px',textDecoration:'none'}}>
          + Shto njoftim falas
        </a>
      </section>

      <Footer />
    </main>
  )
}
