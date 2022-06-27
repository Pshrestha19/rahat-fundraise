import mongoose, { PopulatedDoc } from 'mongoose';

import ICampaign from './Campaign';

interface IUser extends mongoose.Document {
  bio?: string;
  name?: string;
  email: string;
  phone?: string;
  image?: string;
  alias: string;
  address?: string;
  social?: string[];
  walletId?: string;
  isActive?: boolean;
  emailVerified?: boolean;
  isAgency?: boolean;
  otp?: {
    number: number;
    expiry: number;
  };
  campaigns: PopulatedDoc<ICampaign>[];
  createdDate?: number;
  updatedDate?: number;
}

export default IUser;
