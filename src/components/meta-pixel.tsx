/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  🔒 META PIXEL — DO NOT DELETE, MODIFY, OR MOVE THIS FILE          ║
 * ║  🔒 ARCHIVO PROTEGIDO — NO ELIMINAR, MODIFICAR NI MOVER            ║
 * ║                                                                      ║
 * ║  This component loads the Meta (Facebook) Pixel for conversion      ║
 * ║  tracking. It is a CRITICAL business requirement for Imagine        ║
 * ║  Studio Design's marketing and ad performance measurement.           ║
 * ║                                                                      ║
 * ║  ⚠️  REMOVING THIS FILE OR ITS CONTENTS WILL BREAK:                 ║
 * ║      - Meta Ads conversion tracking                                 ║
 * ║      - Ad performance optimization (oCPM, CBO, etc.)                ║
 * ║      - Retargeting / custom audiences                               ║
 * ║      - ROAS measurement                                              ║
 * ║                                                                      ║
 * ║  ❌  NEVER delete this file                                         ║
 * ║  ❌  NEVER comment out its usage in layout.tsx                      ║
 * ║  ❌  NEVER remove the import from layout.tsx                         ║
 * ║  ❌  NEVER wrap it in conditional logic                              ║
 * ║  ❌  NEVER move the pixel ID to another location                     ║
 * ║                                                                      ║
 * ║  Pixel ID: 1739205054172572                                         ║
 * ║  Owner: Imagine Studio Design                                       ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import Script from "next/script";

const META_PIXEL_ID = "1739205054172572";

export default function MetaPixel() {
  return (
    <>
      <Script
        id="meta-pixel-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height={1}
          width={1}
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}