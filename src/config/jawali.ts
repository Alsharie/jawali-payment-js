export interface JawaliConfig {
    auth: {
      phone: string;
      username: string;
      password: string;
      org_id: string;
      user_id: string;
      external_user: string;
      wallet: string;
      wallet_identifier: string;
      wallet_password: string;
    };
    url: {
      base: string;
      disableSslVerification: boolean ;
    };
  }
  
export {}