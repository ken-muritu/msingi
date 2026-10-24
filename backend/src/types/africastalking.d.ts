declare module 'africastalking' {
  interface ATOptions {
    apiKey: string;
    username: string;
  }
  interface SMSSendOptions {
    to: string[];
    message: string;
    from?: string;
  }
  interface ATInstance {
    SMS: {
      send(options: SMSSendOptions): Promise<any>;
    };
  }
  function AfricasTalking(options: ATOptions): ATInstance;
  export = AfricasTalking;
}
