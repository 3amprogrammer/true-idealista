type Log = {
  message: string,
  context?: any
}

export default class Logger {
  private readonly className: string;
  private readonly color: string;
  private readonly debug: any;

  constructor(className: string) {
    this.className = className;
    this.color = LOGGER_COLOR;
    this.debug = LOGGER_DEBUG;
  }

  log(message: string, context?: any) {
    if (!this.debug) {
      return;
    }

    console.log(`%c[${this.className}]%c ${message}`, `color: ${this.color}; font-weight: bold;`, `color: #555555`);

    context && console.log(context);
  }

  group(label: string) {
    if (!this.debug) {
      return {
        log: () => {
        },
        end: () => {
        },
      };
    }

    const logs: Log[] = [];

    return {
      log: (message: string, context?: any) => {
        logs.push({
          message,
          context,
        });
      },

      end: () => {
        console.groupCollapsed(`%c[${this.className}]%c ${label}`, `color: ${this.color}; font-weight: bold;`, `color: #555555`);

        logs.forEach(({ message, context }) => {
          console.log(message);
          context && console.log(context);
        });

        console.groupEnd();
      },
    };
  }
}