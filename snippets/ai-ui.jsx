// AI connector pages (card #1310): the layout from Maurice's "AI connector docs: the new page layout"
// proposal. Styles live in /ai-connector.css; every class starts with lsai- so nothing else on the site changes.
// Mintlify compiles each exported component on its own, so no component here may use another one.

// The head (title, Watch it first, progress bar) stays at the top while the page scrolls, on pages that show
// the progress bar (stage), where the screen is big enough (CSS decides). Once pinned it gets shorter (no
// subtitle) and grows its bottom margin by the same amount, so the page never jumps (scroll anchoring is paused
// while it switches). The progress bar follows the
// step on screen: steps and the test box carry data-stage. The video opens over the page, outside the pinned head,
// so it can cover Mintlify's own header.
export const AiPage = ({ title, subtitle, video, poster, stage, children }) => {
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(stage);
  const pageRef = useRef(null);
  const markRef = useRef(null);
  const topRef = useRef(null);
  const watchRef = useRef(null);
  const closeRef = useRef(null);
  useEffect(() => {
    if (!stage || !topRef.current || !pageRef.current) return undefined;
    const page = pageRef.current;
    const top = topRef.current;
    let frame = 0;
    const update = () => {
      frame = 0;
      const css = getComputedStyle(top);
      const stuck = css.position === "sticky" && markRef.current.getBoundingClientRect().top < (parseFloat(css.top) || 0);
      if (stuck !== top.classList.contains("lsai-top-stuck")) {
        const root = document.documentElement;
        root.style.overflowAnchor = "none";
        requestAnimationFrame(() => requestAnimationFrame(() => { root.style.overflowAnchor = ""; }));
        if (stuck) {
          // Grow the margin first, so the page is never shorter for a moment (a short page would clamp the scroll).
          const before = top.offsetHeight;
          const margin = parseFloat(css.marginBottom) || 0;
          top.style.marginBottom = margin + before + "px";
          top.classList.add("lsai-top-stuck");
          top.style.marginBottom = margin + before - top.offsetHeight + "px";
        } else {
          top.classList.remove("lsai-top-stuck");
          top.style.marginBottom = "";
        }
      }
      // A step counts once its top passes a line just under the head; at the very bottom of the page the last
      // step counts too, because it can't scroll up that far.
      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
      const line = atEnd ? Infinity : top.getBoundingClientRect().bottom + 120;
      if (stuck) {
        const height = top.offsetHeight + "px";
        if (document.documentElement.style.getPropertyValue("--lsai-pinned-h") !== height) {
          document.documentElement.style.setProperty("--lsai-pinned-h", height);
        }
      }
      let next = stage;
      page.querySelectorAll("[data-stage]").forEach((el) => {
        if (el.getBoundingClientRect().top < line) next = Number(el.getAttribute("data-stage"));
      });
      setCurrent(next);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const reset = () => {
      top.classList.remove("lsai-top-stuck");
      top.style.marginBottom = "";
      schedule();
    };
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    if (observer) {
      observer.observe(top, { box: "border-box" });
      observer.observe(page);
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", reset);
    update();
    return () => {
      document.documentElement.style.removeProperty("--lsai-pinned-h");
      if (observer) observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", reset);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [stage, title]);
  useEffect(() => {
    if (!playing) return undefined;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    if (closeRef.current) closeRef.current.focus({ preventScroll: true });
    return () => {
      root.style.overflow = overflow;
      if (watchRef.current) watchRef.current.focus({ preventScroll: true });
    };
  }, [playing]);
  const stages = ["Get ready", "Add it to your AI", "Sign in", "Click Allow", "Ask a question"];
  return (
    <div ref={pageRef} className={stage ? "lsai-page lsai-page-pinned" : "lsai-page"}>
      <div ref={markRef} className="lsai-top-mark" aria-hidden="true" />
      <div ref={topRef} className="lsai-top">
        <div className="lsai-head">
          <div className="lsai-head-text">
            <h1 className="lsai-title">{title}</h1>
            {subtitle && <p className="lsai-subtitle">{subtitle}</p>}
          </div>
          {video && (
            <button ref={watchRef} type="button" className="lsai-video-button" onClick={() => setPlaying(true)}>
              <span className="lsai-video-play" aria-hidden="true">▶</span>
              <span className="lsai-video-label"><strong>Watch it first</strong><span>Short setup video</span></span>
            </button>
          )}
        </div>
        {stage && (
          <div className="lsai-progress-wrap">
            <ol className="lsai-progress" aria-label="Setup progress">
              {stages.map((label, i) => {
                const n = i + 1;
                const state = n < current ? "lsai-done" : n === current ? "lsai-current" : "lsai-todo";
                return (
                  <li key={label} className={"lsai-progress-item " + state} aria-current={n === current ? "step" : undefined}>
                    <span className="lsai-progress-bar" />
                    <span className="lsai-progress-label">{label}</span>
                  </li>
                );
              })}
            </ol>
            <div className="lsai-progress-now">{stages[current - 1]}</div>
          </div>
        )}
      </div>
      {playing && (
        <div className="lsai-lightbox lsai-video-box" role="dialog" aria-modal="true" aria-label={title + ": setup video"} tabIndex={-1}
             onClick={(e) => { if (e.target === e.currentTarget) setPlaying(false); }}
             onKeyDown={(e) => {
               if (e.key === "Escape") setPlaying(false);
               if (e.key === "Tab") {
                 e.preventDefault();
                 const close = e.currentTarget.querySelector("button");
                 (document.activeElement === close ? e.currentTarget.querySelector("video") : close).focus({ preventScroll: true });
               }
             }}>
          <button ref={closeRef} type="button" className="lsai-lightbox-close" onClick={() => setPlaying(false)}>Close</button>
          <video className="lsai-video-player" controls autoPlay playsInline tabIndex={0} poster={poster} src={video} />
          <span className="lsai-lightbox-note">Click Close when you are done</span>
        </div>
      )}
      {children}
    </div>
  );
};

// One step: number, "Step X of N", title, text, and one or more full-window pictures on the right.
// A picture opens large on the same page; a click anywhere closes it (not the second click of a double-click,
// which would close it right after it opens).
export const AiStep = ({ id, n, total, label, title, img, caption, imgs, stage, children }) => {
  const [open, setOpen] = useState(null);
  const closeRef = useRef(null);
  const openerRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    if (closeRef.current) closeRef.current.focus({ preventScroll: true });
    return () => {
      root.style.overflow = overflow;
      if (openerRef.current) openerRef.current.focus({ preventScroll: true });
    };
  }, [open]);
  const pictures = imgs || (img ? [{ src: img, caption }] : []);
  return (
    <div className="lsai-step" id={id} data-stage={stage}>
      <div className="lsai-step-num" aria-hidden="true">{n}</div>
      <div className="lsai-step-main">
        <div className="lsai-step-label">{label || "Step " + n + " of " + total}</div>
        <div className="lsai-step-title">{title}</div>
        <div className="lsai-step-text">{children}</div>
      </div>
      {pictures.length > 0 && (
        <div className="lsai-thumbs">
          {pictures.map((pic) => (
            <a key={pic.src} className="lsai-thumb" href={pic.src} title="Click to see it larger"
               onClick={(e) => { e.preventDefault(); openerRef.current = e.currentTarget; setOpen(pic); }}>
              <img src={pic.src} alt="" loading="lazy" />
              <span className="lsai-thumb-caption">{pic.caption ? pic.caption + " · " : ""}click to enlarge</span>
            </a>
          ))}
        </div>
      )}
      {open && (
        <div className="lsai-lightbox" role="dialog" aria-modal="true" aria-label={open.caption || title}
             onClick={(e) => { if (e.detail < 2) setOpen(null); }}
             onKeyDown={(e) => { if (e.key === "Escape") setOpen(null); if (e.key === "Tab") e.preventDefault(); }}>
          <button ref={closeRef} type="button" className="lsai-lightbox-close" onClick={() => setOpen(null)}>Close</button>
          <img src={open.src} alt={open.caption || title} />
          <span className="lsai-lightbox-note">{open.caption ? open.caption + " · " : ""}Click anywhere to close</span>
        </div>
      )}
    </div>
  );
};

export const AiCopy = ({ label, text }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }).catch(() => {});
    }
  };
  return (
    <div className="lsai-copy">
      {label && <div className="lsai-copy-label">{label}</div>}
      <div className="lsai-copy-row">
        <code className="lsai-copy-text">{text}</code>
        <button type="button" className="lsai-copy-button" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
      </div>
    </div>
  );
};

export const AiButton = ({ href, children, outline, newTab }) => (
  <a className={outline ? "lsai-btn lsai-btn-outline" : "lsai-btn"} href={href}
     target={newTab ? "_blank" : undefined} rel={newTab ? "noopener noreferrer" : undefined}>{children}</a>
);

export const AiChoice = ({ title, children, href, cta }) => (
  <div className="lsai-choice">
    <div className="lsai-choice-title">{title}</div>
    <div className="lsai-choice-text">{children}</div>
    {href && cta && (
      <div className="lsai-choice-action">
        <a className="lsai-btn" href={href}>{cta}</a>
      </div>
    )}
  </div>
);

export const AiNote = ({ tone, children }) => (
  <div className={"lsai-note lsai-note-" + (tone || "gray")}>{children}</div>
);

export const AiTest = ({ text, stage, children }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }).catch(() => {});
    }
  };
  return (
    <div className="lsai-test" data-stage={stage}>
      <div className="lsai-test-main">
        <div className="lsai-test-title">Last step: test it in a new chat</div>
        <div className="lsai-test-text">“{text}”</div>
        {children && <div className="lsai-test-more">{children}</div>}
      </div>
      <button type="button" className="lsai-btn lsai-test-button" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
    </div>
  );
};

// A titled box. An optional picture shows under the text and opens large on the same page, like a step's.
export const AiBox = ({ id, title, img, caption, children }) => {
  const [open, setOpen] = useState(false);
  const closeRef = useRef(null);
  const openerRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    if (closeRef.current) closeRef.current.focus({ preventScroll: true });
    return () => {
      root.style.overflow = overflow;
      if (openerRef.current) openerRef.current.focus({ preventScroll: true });
    };
  }, [open]);
  return (
    <div className="lsai-box" id={id}>
      {title && <div className="lsai-box-title">{title}</div>}
      <div className="lsai-box-text">{children}</div>
      {img && (
        <a className="lsai-thumb lsai-box-thumb" href={img} title="Click to see it larger"
           onClick={(e) => { e.preventDefault(); openerRef.current = e.currentTarget; setOpen(true); }}>
          <img src={img} alt="" loading="lazy" />
          <span className="lsai-thumb-caption">{caption ? caption + " · " : ""}click to enlarge</span>
        </a>
      )}
      {open && (
        <div className="lsai-lightbox" role="dialog" aria-modal="true" aria-label={caption || title}
             onClick={(e) => { if (e.detail < 2) setOpen(false); }}
             onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); if (e.key === "Tab") e.preventDefault(); }}>
          <button ref={closeRef} type="button" className="lsai-lightbox-close" onClick={() => setOpen(false)}>Close</button>
          <img src={img} alt={caption || title} />
          <span className="lsai-lightbox-note">{caption ? caption + " · " : ""}Click anywhere to close</span>
        </div>
      )}
    </div>
  );
};

// The support address as a plain email link. Mintlify sends links inside components that take props, and
// markdown links, to a new tab, which shows as an empty page for an email link; this one takes no props.
export const AiEmail = () => <a href="mailto:support@ledgersync.com">support@ledgersync.com</a>;

export const AiStuck = () => (
  <div className="lsai-stuck">
    Stuck? <a href="https://ledgersync.com/book-a-demo" target="_blank" rel="noopener noreferrer">Book a call with
    our team</a> and we'll help you, or email{" "}
    <a href="mailto:support@ledgersync.com">support@ledgersync.com</a> with the step and what the screen says.
    Never send passwords or card numbers.
  </div>
);
