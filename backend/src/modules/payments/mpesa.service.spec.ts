import { MpesaService } from './mpesa.service';

describe('MpesaService', () => {
  let service: MpesaService;

  beforeEach(() => {
    service = new MpesaService();
  });

  // ─── formatPhone ────────────────────────────────────────────────────────

  describe('formatPhone', () => {
    it('converts 07XX number to 2547XX', () => {
      expect(service.formatPhone('0712345678')).toBe('254712345678');
    });

    it('converts +254 to 254', () => {
      expect(service.formatPhone('+254712345678')).toBe('254712345678');
    });

    it('leaves 254 prefix untouched', () => {
      expect(service.formatPhone('254712345678')).toBe('254712345678');
    });

    it('strips spaces and non-digits before formatting', () => {
      expect(service.formatPhone('0712 345 678')).toBe('254712345678');
    });

    it('handles bare 9-digit number by prepending 254', () => {
      expect(service.formatPhone('712345678')).toBe('254712345678');
    });
  });

  // ─── generatePassword ───────────────────────────────────────────────────

  describe('generatePassword', () => {
    it('returns a 14-char timestamp and base64 password', () => {
      const { timestamp, password } = service.generatePassword();
      expect(timestamp).toMatch(/^\d{14}$/);
      expect(Buffer.from(password, 'base64').toString()).toBeTruthy();
    });

    it('generates different passwords at different times', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-01T00:00:00Z'));
      const first = service.generatePassword().password;

      jest.setSystemTime(new Date('2024-01-01T00:01:00Z'));
      const second = service.generatePassword().password;

      expect(first).not.toBe(second);
      jest.useRealTimers();
    });
  });

  // ─── validateCallback ───────────────────────────────────────────────────

  describe('validateCallback', () => {
    const successCallback = {
      Body: {
        stkCallback: {
          MerchantRequestID: 'req-1',
          CheckoutRequestID: 'ws_CO_123',
          ResultCode: 0,
          ResultDesc: 'The service request is processed successfully.',
          CallbackMetadata: {
            Item: [
              { Name: 'Amount', Value: 1500 },
              { Name: 'MpesaReceiptNumber', Value: 'PGN123456' },
              { Name: 'TransactionDate', Value: 20240101120000 },
              { Name: 'PhoneNumber', Value: 254712345678 },
            ],
          },
        },
      },
    };

    const failureCallback = {
      Body: {
        stkCallback: {
          MerchantRequestID: 'req-2',
          CheckoutRequestID: 'ws_CO_456',
          ResultCode: 1032,
          ResultDesc: 'Request cancelled by user.',
        },
      },
    };

    it('returns success=true for ResultCode 0', () => {
      const result = service.validateCallback(successCallback);
      expect(result.success).toBe(true);
      expect(result.checkoutRequestId).toBe('ws_CO_123');
      expect(result.mpesaReceiptNumber).toBe('PGN123456');
      expect(result.amount).toBe(1500);
    });

    it('returns success=false for non-zero ResultCode', () => {
      const result = service.validateCallback(failureCallback);
      expect(result.success).toBe(false);
      expect(result.resultCode).toBe(1032);
      expect(result.resultDesc).toBe('Request cancelled by user.');
    });

    it('handles missing body gracefully', () => {
      const result = service.validateCallback({});
      expect(result.success).toBe(false);
      expect(result.checkoutRequestId).toBe('');
      expect(result.resultCode).toBe(-1);
    });

    it('handles null input gracefully', () => {
      const result = service.validateCallback(null);
      expect(result.success).toBe(false);
    });
  });
});
