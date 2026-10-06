
import { useEffect, useState } from "react";
import { site } from "./content";

/** PDF mavjudligini tekshiradi; fayl bo'lmasa tugma buzilmaydi — "tez orada" holatiga o'tadi. */
export default function DownloadResume({ className = "" }: { className?: string }) {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(site.resumePdf, { method: "HEAD" })
      .then((r) => alive && setOk(r.ok))
      .catch(() => alive && setOk(false));
    return () => {
      alive = false;
    };
  }, []);

  if (ok === false) {
    return (
      <span aria-disabled className={`btn-secondary cursor-not-allowed opacity-60 ${className}`}>
        Rezyume tez orada
      </span>
    );
  }

  return (
    <a href={site.resumePdf} download className={`btn-primary ${className}`}>
      Rezyumeni yuklab olish <span aria-hidden>↓</span>
    </a>
  );
}
