type LogLevel = 'info' | 'warn' | 'error' | 'good' | 'debug';
interface LogConfig {
  label: string;
  style: string;
}

const consoleMethods: Record<LogLevel, (...args: any[]) => void> = {
  info: console.info,
  debug: console.debug,
  warn: console.warn,
  error: console.error,
  good: console.log, // fallback for custom level
};

const logStyles: Record<LogLevel, LogConfig> = {
  info: {
    label: '[INFO]',
    style:
      'background: #3b82f6; font-weight: bold; color: white; padding: 2px 6px; border-radius: 4px;',
  },
  debug: {
    label: '🐞 [DEBUG]',
    style:
      'background: #9ca3af; color: black; padding: 2px 6px; border-radius: 4px;', // Tailwind gray-400
  },
  warn: {
    label: '⚠️[WARN]',
    style:
      'background: #facc15; font-weight: bold;  color: black; padding: 2px 6px; border-radius: 4px;',
  },
  error: {
    label: '❌[ERROR]',
    style:
      'background: #ef4444; font-weight: bold; color: white; padding: 2px 6px; border-radius: 4px;',
  },
  good: {
    label: '✅ [SUCCESS]',
    style:
      'background:#77B255; font-weight: bold;  color: white; padding: 2px 6px; border-radius: 4px;',
  },
};

function createLogger(level: LogLevel) {
  const { label, style } = logStyles[level];
  const method: any = consoleMethods[level];

  return (...args: unknown[]) => {
    const styledParts: string[] = [];
    const unstyledParts: unknown[] = [];

    for (const arg of args) {
      typeof arg === 'string' ? styledParts.push(arg) : unstyledParts.push(arg);
    }

    const styledMessage = `${label} ${styledParts.join(' ')}`;
    method(`%c${styledMessage}`, style, ...unstyledParts);
  };
}

const log = {
  info: createLogger('info'),
  debug: createLogger('debug'),
  warn: createLogger('warn'),
  error: createLogger('error'),
  good: createLogger('good'),
};

export default log;

console.log(
  '%c CryptoWin!!',
  'font-weight: bold; font-size: 50px; color: #ce3e34; text-shadow: \
3px 3px 0 #f7a541, \
6px 6px 0 #f4cf58, \
9px 9px 0 #84c5c3, \
12px 12px 0 #fef6e4',
);
