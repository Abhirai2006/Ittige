import './globals.css';
const url='https://ittige.vercel.app';
export const metadata={metadataBase:new URL(url),title:'Ittige | Mysuru plastic waste into pavers and solid blocks',description:'A social enterprise business plan: turning low-value plastic waste into pavers and solid blocks in Mysuru. Scroll to watch a block being made.',openGraph:{title:'Ittige',description:"Turning Mysuru's plastic waste into pavers and solid blocks. Scroll to watch a block being made.",url,siteName:'Ittige',type:'website',images:[{url:'/og.png',width:1200,height:630,alt:"Ittige: turning Mysuru's plastic waste into pavers and solid blocks"}]},twitter:{card:'summary_large_image',title:'Ittige',description:"Turning Mysuru's plastic waste into pavers and solid blocks.",images:['/og.png']}};
export const viewport={themeColor:'#B5432A'};
export default function RootLayout({children}){return(<html lang="en"><body>{children}</body></html>);}
