export enum FurnishedStatus {
  FULL = 'FULL',
  PARTIAL = 'PARTIAL',
  UNKNOWN = 'UNKNOWN',
}

export enum PetPolicy {
  YES = 'YES',
  NO = 'NO',
  NEGOTIABLE = 'NEGOTIABLE',
  UNKNOWN = 'UNKNOWN',
}

export enum VerificationStatus {
  VERIFIED_LIVE = 'VERIFIED_LIVE',
  PARTIAL = 'PARTIAL',
  DEAD = 'DEAD',
}

export enum ShortlistState {
  NEW = 'NEW',
  SHORTLISTED = 'SHORTLISTED',
  CONTACTED = 'CONTACTED',
  WAITING = 'WAITING',
  REJECTED = 'REJECTED',
  BOOKED = 'BOOKED',
}

export enum RejectReasonCode {
  REJECT_SHARED = 'REJECT_SHARED',
  REJECT_UNFURNISHED = 'REJECT_UNFURNISHED',
  REJECT_NO_KITCHEN = 'REJECT_NO_KITCHEN',
  REJECT_TERM = 'REJECT_TERM',
  REJECT_BUDGET = 'REJECT_BUDGET',
  REJECT_DEAD_LINK = 'REJECT_DEAD_LINK',
}

export enum CommuteClass {
  GOOD = 'GOOD',
  OK = 'OK',
  WEAK = 'WEAK',
}
