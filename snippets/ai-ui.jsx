// AI connector pages (card #1310): the layout from Maurice's "AI connector docs: the new page layout"
// proposal. Styles live in /ai-connector.css; every class starts with lsai- so nothing else on the site changes.

export const AiPage = ({ title, subtitle, children }) => (
  <div className="lsai-page">
    <h1 className="lsai-title">{title}</h1>
    {subtitle && <p className="lsai-subtitle">{subtitle}</p>}
    {children}
  </div>
);

export const AiProgress = ({ current }) => {
  const stages = ["Pick your AI", "Add it to your AI", "Sign in", "Click Allow", "Ask a question"];
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
              <span className="lsai-progress-num">{n}</span>
              {label}
            </span>
          </li>
        );
      })}
    </ol>
    <div className="lsai-progress-now">Step {current} of {stages.length} · {stages[current - 1]}</div>
    </div>
  );
};

export const AiStep = ({ id, n, total, title, img, alt, caption, children }) => (
  <div className="lsai-step" id={id}>
    <div className="lsai-step-num" aria-hidden="true">{n}</div>
    <div className="lsai-step-main">
      <div className="lsai-step-label">Step {n} of {total}</div>
      <div className="lsai-step-title">{title}</div>
      <div className="lsai-step-text">{children}</div>
    </div>
    {img && (
      <a className="lsai-thumb" href={img} target="_blank" rel="noopener noreferrer" title="Open the full picture">
        <img src={img} alt={alt || caption || title} loading="lazy" />
        {caption && <span className="lsai-thumb-caption">{caption}</span>}
      </a>
    )}
  </div>
);

export const AiCopy = ({ label, text }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      });
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

export const AiButton = ({ href, children, outline }) => (
  <a className={outline ? "lsai-btn lsai-btn-outline" : "lsai-btn"} href={href}>{children}</a>
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
      });
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

export const AiBox = ({ id, title, children }) => (
  <div className="lsai-box" id={id}>
    {title && <div className="lsai-box-title">{title}</div>}
    <div className="lsai-box-text">{children}</div>
  </div>
);

export const AiStuck = () => (
  <div className="lsai-stuck">
    Stuck? Email <a href="mailto:support@ledgersync.com">support@ledgersync.com</a> with the step and what the
    screen says. Never send passwords or card numbers.
  </div>
);
