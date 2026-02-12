import React from "react";
export default function JsonLd({ data }) {
    return (<script type="application/ld+json" 
    // JSON-LD must be injected as a raw string.
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}/>);
}
