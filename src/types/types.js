export type Session = {
  balance: number,
  damage: number,
  damagePerHour: number,
  healing: number,
  healingPerHour: number,
  killedMonsters: KilledMonster[],
  loot: number,
  lootedItems: LootItem[],
  session: {
    end: string,
    duration: string,
    start: string,
  },
  supplies: number,
  xpGain: number,
  xpPerHour: number,
};

export type KilledMonster = {
  count: number,
  name: string,
};

export type LootItem = {
  count: number,
  name: string,
};

export type JSONConfigFile = {
  configPath: string,
  tibiaClientPath: string,
  dirRoot: string,
};

export interface PayPal {
  Buttons(options: PayPalButtonOptions): PayPalButtons;
}

export interface PayPalButtonOptions {
  onApprove: (
    data: PayPalOnApproveData,
    actions: PayPalActions
  ) => Promise<void>;
  onError?: (error: PayPalError) => void;
  onCancel?: () => void;
  createSubscription: (
    data: PayPalCreateSubscriptionData,
    actions: PayPalCreateSubscriptionActions
  ) => void;
  style?: PayPalButtonStyle;
}

export interface PayPalCreateSubscriptionData {
  plan_id: string;
}

export interface PayPalCreateSubscriptionActions {
  subscription: {
    create: (data: PayPalCreateSubscriptionData) => Promise<string>,
  };
}

export interface PayPalError {
  name: string;
  message: string;
  details: {
    field: string,
    value: string,
    issue: string,
  }[];
}

export interface PayPalPurchaseUnit {
  amount: PayPalAmount;
}

export interface PayPalAmount {
  currency_code: string;
  value: string;
}

export interface PayPalOnApproveData {
  subscriptionID(subscriptionID): unknown;
  orderID: string;
}

export interface PayPalActions {
  order: {
    capture: () => Promise<PayPalCaptureResponse>,
  };
  subscription: {
    create: (
      data: PayPalCreateSubscriptionData
    ) => Promise<PayPalCreateSubscriptionResponse>,
  };
}

export interface PayPalCaptureResponse {
  status: string;
  id: string;
  create_time: string;
  update_time: string;
  amount: PayPalAmount;
}

export interface PayPalButtonStyle {
  layout?: 'horizontal' | 'vertical';
  color?: 'gold' | 'blue' | 'silver' | 'white' | 'black';
  shape?: 'rect' | 'pill';
  label?:
    | 'checkout'
    | 'pay'
    | 'buynow'
    | 'paypal'
    | 'installment'
    | 'subscribe';
  height?: number;
}

export interface PayPalButtons {
  render(element: HTMLElement | string): void;
  isEligible(): Promise<boolean>;
  close(): void;
  enable(): void;
  disable(): void;
  update(options: PayPalButtonOptions): void;
}

interface PayPalCreateSubscriptionResponse {
  subscriptionID: string; // The unique identifier for the subscription
  billingToken: string; // A token representing the subscription
  startTime: string; // The date and time when the subscription starts
  updateTime: string; // The date and time when the subscription was last updated
  status: string; // The current status of the subscription
  plan_id: string; // The unique identifier for the subscription plan
  plan_name: string; // The name of the subscription plan
  plan_description: string; // The description of the subscription plan
}
