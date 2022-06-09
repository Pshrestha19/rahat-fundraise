const {
  connectDatabase,
  closeDatabase,
  clearDatabase,
  convertToObjectID,
  getCreatedUser,
  getCreatedCampaign,
} = require('../mongo');
const {
  listUsers,
  addUser,
  getProfile,
} = require('../../controllers/User.controller');
const {
  addCampaign,
  getCampaigns,
  updateCampaignStatus,
  getCampaignById,
} = require('../../controllers/Campaign.controller');
const {
  getDonationsForCampaign,
  addDonation,
} = require('../../controllers/Donation.controller');

let user: { id: any }[] = [];
let createdCampaign: any[] = [];

describe('User Controller', () => {
  beforeAll(async () => {
    await connectDatabase();
    user = await getCreatedUser();
  });
  afterAll(async () => {
    await clearDatabase();
    await closeDatabase();
  });

  it('list all user users', async () => {
    const mockRequest = {};
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };

    await listUsers(mockRequest, mockResponse);
    const userList = user;

    expect(mockResponse.json).toBeCalledWith({
      ok: true,
      msg: 'User Route Reached',
      data: userList,
    });
  });

  it('add new user', async () => {
    const mockRequest = {
      body: {
        alias: 'makai',
        email: 'test@test.com',
      },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };

    await addUser(mockRequest, mockResponse);
    expect(mockResponse.json).toHaveBeenCalledWith({
      ok: true,
      msg: 'New User added',
      data: expect.anything(),
    });
  });

  it('add new user with same email', async () => {
    const mockRequest = {
      body: {
        alias: 'makai',
        email: 'test@test.com',
      },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };

    await addUser(mockRequest, mockResponse);
    expect(mockResponse.status).toBeCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'email already in use',
    });
  });

  it('add new user with same alias', async () => {
    const mockRequest = {
      body: {
        alias: 'makai',
        email: 'test2@test.com',
      },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };

    await addUser(mockRequest, mockResponse);
    expect(mockResponse.status).toBeCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'alias already in use',
    });
  });

  it('get profile of random fake id', async () => {
    const mockRequest = {
      userId: convertToObjectID('578df3efb618f5141202a196'),
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };

    await getProfile(mockRequest, mockResponse);
    expect(mockResponse.status).toBeCalledWith(401);
    expect(mockResponse.json).toBeCalledWith({
      ok: false,
      msg: 'User does not exist.',
    });
  });
});

describe('Campaign Controller', () => {
  beforeAll(async () => {
    await connectDatabase();
    user = await getCreatedUser();
    createdCampaign = await getCreatedCampaign(user[0].id);
  });
  afterAll(async () => {
    await clearDatabase();
    await closeDatabase();
  });

  it('list all campaign', async () => {
    const mockRequest = {};
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };

    await getCampaigns(mockRequest, mockResponse);

    expect(mockResponse.json).toBeCalledWith({
      ok: true,
      msg: 'Campaigns found.',
      data: createdCampaign,
    });
  });

  it('list created campaign by id', async () => {
    const mockRequest = {
      params: {
        campaignId: createdCampaign[0].id,
      },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };

    await getCampaignById(mockRequest, mockResponse);

    expect(mockResponse.json).toBeCalledWith({
      ok: true,
      msg: 'Campaign Found.',
      data: createdCampaign[0],
    });
  });

  it('create a new campaign', async () => {
    const stringifiedWallets = [
      {
        name: 'Binance',
        walletAddress: '0x18a6558D507def9456D04AbA8DbC425e7386Aa96',
      },
    ];
    const mockRequest = {
      body: {
        file: {
          filename: 'test.png',
        },
        wallets: JSON.stringify(stringifiedWallets),
        title: 'title 1',
        story: 'This is story',
        target: 1000,
        expiryDate: '2099-01-01',
        status: 'PUBLISHED',
      },
      userId: user[0].id,
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };

    await addCampaign(mockRequest, mockResponse);
    expect(mockResponse.json).toBeCalledWith({
      ok: true,
      msg: 'Campaign Added',
      data: expect.anything(),
    });
  });

  it('update a campaign status', async () => {
    const mockRequest = {
      params: {
        campaignId: createdCampaign[0].id,
      },
      body: {
        status: 'DRAFT',
      },
      userId: user[0].id,
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };

    await updateCampaignStatus(mockRequest, mockResponse);
    expect(mockResponse.json).toBeCalledWith({
      ok: true,
      msg: 'Campaign Status Updated',
      data: expect.anything(),
    });
  });
});

describe('Donation Controller', () => {
  beforeAll(async () => {
    await connectDatabase();
    user = await getCreatedUser();
    createdCampaign = await getCreatedCampaign(user[0].id);
  });
  afterAll(async () => {
    await clearDatabase();
    await closeDatabase();
  });

  it('list all donations for a campaign', async () => {
    const mockRequest = {
      params: {
        campaignId: createdCampaign[0].id,
      },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };

    await getDonationsForCampaign(mockRequest, mockResponse);

    expect(mockResponse.json).toBeCalledWith({
      ok: true,
      msg: 'Donation Route Reached',
      data: [],
    });
  });

  // mail send failed due to external service...
  // it('make a donation for a campaign', async () => {
  //   const mockRequest = {
  //     body: {
  //       campaignId: createdCampaign[0].id,
  //       transactionId: 'TrnsactionID',
  //       walletAddress: 'Wallet 1',
  //       isAnonymous: true,
  //       amount: 100,
  //     },
  //   };
  //   const mockResponse = {
  //     status: jest.fn().mockReturnThis(),
  //     send: jest.fn(),
  //     json: jest.fn(),
  //   };

  //   await addDonation(mockRequest, mockResponse);

  //   expect(mockResponse.json).toBeCalledWith({
  //     ok: true,
  //     msg: 'Donation Added',
  //     data: expect.anything(),
  //   });
  // });
});
