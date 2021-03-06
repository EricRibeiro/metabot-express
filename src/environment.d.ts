declare global {
    namespace NodeJS {
      interface ProcessEnv {
        PRIVATE_KEY: string;
        NODE_ENV: 'development' | 'production';
        PORT?: string;
        MONGO_CONN_STRING: string;
        APP_ID: number;
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}