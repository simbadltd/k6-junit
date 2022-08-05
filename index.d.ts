export interface k6JunitConfiguration{
  includeThresholds: boolean;
  testCasePassCondition: (passed: number, failed: number) => boolean;
}

export function jUnit(data: any, cfg?: k6JunitConfiguration): any;

