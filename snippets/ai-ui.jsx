// AI connector pages (card #1310): the layout from Maurice's "AI connector docs: the new page layout"
// proposal. Styles live in /ai-connector.css; every class starts with lsai- so nothing else on the site changes.
// Mintlify compiles each exported component on its own, so no component here may use another one.

export const AiPage = ({ title, subtitle, video, poster, children }) => (
  <div className="lsai-page">
    <div className="lsai-head">
      <div className="lsai-head-text">
        <h1 className="lsai-title">{title}</h1>
        {subtitle && <p className="lsai-subtitle">{subtitle}</p>}
      </div>
      {video && (
        <details className="lsai-video">
          <summary className="lsai-video-button">
            <span className="lsai-video-play" aria-hidden="true">▶</span>
            <span className="lsai-video-label"><strong>Watch it first</strong><span>Short setup video</span></span>
          </summary>
          <video className="lsai-video-player" controls preload="metadata" poster={poster} src={video} />
        </details>
      )}
    </div>
    {children}
  </div>
);

export const AiProgress = ({ current }) => {
  const stages = ["Get ready", "Add it to your AI", "Sign in", "Click Allow", "Ask a question"];
  return (
    <div className="lsai-progress-wrap">
      <ol className="lsai-progress" aria-label="Setup progress">
        {stages.map((label, i) => {
          const n = i + 1;
          const state = n < current ? "lsai-done" : n === current ? "lsai-current" : "lsai-todo";
          return (
            <li key={label} className={"lsai-progress-item " + state} aria-current={n === current ? "step" : undefined}>
              <span className="lsai-progress-bar" />
              <span className="lsai-progress-label">
                {label}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="lsai-progress-now">{stages[current - 1]}</div>
    </div>
  );
};

// One step: number, "Step X of N", title, text, and one or more full-window pictures on the right.
// A picture opens large on the same page; a click anywhere closes it.
export const AiStep = ({ id, n, total, label, title, img, caption, imgs, children }) => {
  const [open, setOpen] = useState(null);
  const pictures = imgs || (img ? [{ src: img, caption }] : []);
  return (
    <div className="lsai-step" id={id}>
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
               onClick={(e) => { e.preventDefault(); setOpen(pic); }}>
              <img src={pic.src} alt="" loading="lazy" />
              <span className="lsai-thumb-caption">{pic.caption ? pic.caption + " · " : ""}click to enlarge</span>
            </a>
          ))}
        </div>
      )}
      {open && (
        <div className="lsai-lightbox" role="dialog" aria-modal="true" aria-label={open.caption || title} onClick={() => setOpen(null)}
             onKeyDown={(e) => { if (e.key === "Escape") setOpen(null); if (e.key === "Tab") e.preventDefault(); }}>
          <button type="button" className="lsai-lightbox-close" autoFocus onClick={() => setOpen(null)}>Close</button>
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

export const AiChoice = ({ title, children, href, cta, link, outline }) => (
  <div className="lsai-choice">
    <div className="lsai-choice-title">{title}</div>
    <div className="lsai-choice-text">{children}</div>
    {href && cta && (
      <div className="lsai-choice-action">
        <a className={outline ? "lsai-btn lsai-btn-outline" : "lsai-btn"} href={href}>{cta}</a>
      </div>
    )}
    {href && link && (
      <div className="lsai-choice-action">
        <a className="lsai-link" href={href}>{link}</a>
      </div>
    )}
  </div>
);

export const AiNote = ({ tone, children }) => (
  <div className={"lsai-note lsai-note-" + (tone || "gray")}>{children}</div>
);

export const AiTest = ({ text, children }) => {
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
    <div className="lsai-test">
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
  return (
    <div className="lsai-box" id={id}>
      {title && <div className="lsai-box-title">{title}</div>}
      <div className="lsai-box-text">{children}</div>
      {img && (
        <a className="lsai-thumb lsai-box-thumb" href={img} title="Click to see it larger"
           onClick={(e) => { e.preventDefault(); setOpen(true); }}>
          <img src={img} alt="" loading="lazy" />
          <span className="lsai-thumb-caption">{caption ? caption + " · " : ""}click to enlarge</span>
        </a>
      )}
      {open && (
        <div className="lsai-lightbox" role="dialog" aria-modal="true" aria-label={caption || title} onClick={() => setOpen(false)}
             onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); if (e.key === "Tab") e.preventDefault(); }}>
          <button type="button" className="lsai-lightbox-close" autoFocus onClick={() => setOpen(false)}>Close</button>
          <img src={img} alt={caption || title} />
          <span className="lsai-lightbox-note">{caption ? caption + " · " : ""}Click anywhere to close</span>
        </div>
      )}
    </div>
  );
};

export const AiStuck = () => (
  <div className="lsai-stuck">
    Stuck? <a href="https://ledgersync.com/book-a-demo" target="_blank" rel="noopener noreferrer">Book a call with
    our team</a> and we'll help you, or email{" "}
    <a href="mailto:support@ledgersync.com">support@ledgersync.com</a> with the step and what the screen says.
    Never send passwords or card numbers.
  </div>
);

// The screens a new firm sees when it creates its account on the sign-in page, as sub-steps of the setup page's
// sign-in step (step={3} gives 3a to 3d); `next` is the step that follows.
export const AiCreateAccount = ({ step, next }) => {
  const [open, setOpen] = useState(null);
  const subs = [
    {
      title: "Your work email", img: "/images/ai-connector/full/ls-1-email.png", caption: "Next circled",
      text: [
        <>In step {step} you typed your work email and clicked <strong>Next</strong>.</>,
        <>It must be your work email, not a free email like Gmail, with no plus sign (+).</>,
      ],
    },
    {
      title: "Click Create account", img: "/images/ai-connector/full/ls-3-create-account.png", caption: "Create account circled",
      text: [<>The page says <strong>Create your LedgerSync account</strong>. Click <strong>Create account</strong>.</>],
    },
    {
      title: "Fill in the form", img: "/images/ai-connector/full/ls-4-sign-up-form.png", caption: "NEXT circled",
      text: [
        <>Your email is already there. Type your name, your cell phone and office phone (both are needed), and your firm's name.</>,
        <>Type a password twice: 10 or more characters, with a capital letter, a small letter, a number and a symbol. Click <strong>NEXT</strong>.</>,
      ],
    },
    {
      title: "Add your card", img: null, caption: null,
      text: [
        <>Check your order. Type your card details. Click <strong>Subscribe</strong>. This page is from Zoho, our billing partner. Zoho keeps your card: we never see the full number.</>,
        <>Then we check your new firm by hand. You can add clients right away. Bank connections open after our check.</>,
        <>The page then says <strong>Creating your account</strong>, and may say <strong>Getting your account ready</strong>. Don't close it: it moves on by itself. If it says <strong>Wait 2 minutes, then click Try again</strong>, do that.</>,
        <>When you see <strong>Allow</strong>, do step {next}.</>,
      ],
    },
  ];
  const letters = ["a", "b", "c", "d"];
  return (
    <div className="lsai-substeps">
      {subs.map((sub, i) => (
        <div className="lsai-step" key={sub.title}>
          <div className="lsai-step-num lsai-step-num-sub" aria-hidden="true">{step}{letters[i]}</div>
          <div className="lsai-step-main">
            <div className="lsai-step-label">Step {step}{letters[i]}</div>
            <div className="lsai-step-title">{sub.title}</div>
            <div className="lsai-step-text">
              {sub.text.map((line, j) => <p key={j}>{line}</p>)}
            </div>
          </div>
          {sub.img && (
            <div className="lsai-thumbs">
              <a className="lsai-thumb" href={sub.img} title="Click to see it larger"
                 onClick={(e) => { e.preventDefault(); setOpen(sub); }}>
                <img src={sub.img} alt="" loading="lazy" />
                <span className="lsai-thumb-caption">{sub.caption} · click to enlarge</span>
              </a>
            </div>
          )}
        </div>
      ))}
      {open && (
        <div className="lsai-lightbox" role="dialog" aria-modal="true" aria-label={open.caption} onClick={() => setOpen(null)}
             onKeyDown={(e) => { if (e.key === "Escape") setOpen(null); if (e.key === "Tab") e.preventDefault(); }}>
          <button type="button" className="lsai-lightbox-close" autoFocus onClick={() => setOpen(null)}>Close</button>
          <img src={open.img} alt={open.caption} />
          <span className="lsai-lightbox-note">{open.caption} · Click anywhere to close</span>
        </div>
      )}
    </div>
  );
};
