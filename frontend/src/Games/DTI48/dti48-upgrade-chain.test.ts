import computeDTI48UpgradeChain, {
  treeifyIDOLMembers,
  SimplifiedMemberForTreeGeneration,
  OPS_LEAD_NETID,
  PRODUCT_LEAD_NETID,
  BUSINESS_LEAD_NETID,
  DESIGN_LEAD_NETIDS,
  DEV_LEAD_NETIDS
} from './dti48-upgrade-chain';

const opsLead = {
  netid: OPS_LEAD_NETID,
  role: 'lead',
  subteams: ['leads']
} as const;

const productLead = {
  netid: PRODUCT_LEAD_NETID,
  role: 'lead',
  subteams: ['leads']
} as const;

const businessLead = {
  netid: BUSINESS_LEAD_NETID,
  role: 'lead',
  subteams: ['leads']
} as const;

const designLeads = DESIGN_LEAD_NETIDS.map(
  (netid) =>
    ({
      netid,
      role: 'lead',
      subteams: ['leads']
    } as const)
);

const devLeads = DEV_LEAD_NETIDS.map(
  (netid) =>
    ({
      netid,
      role: 'lead',
      subteams: ['leads']
    } as const)
);

const tpms = [
  { netid: 'tpm1', role: 'tpm', subteams: ['t1'] },
  { netid: 'tpm2', role: 'tpm', subteams: ['t2'] }
] as const;

const pms = [
  { netid: 'pm1', role: 'pm', subteams: ['t1'] },
  { netid: 'pm2', role: 'pm', subteams: ['t2'] }
] as const;

const business = [
  { netid: 'b1', role: 'business', subteams: ['business'] },
  { netid: 'b2', role: 'business', subteams: ['business'] }
] as const;

const designs = [
  { netid: 'design1', role: 'designer', subteams: ['t1'] },
  { netid: 'design2', role: 'designer', subteams: ['t1'] },
  { netid: 'design23', role: 'designer', subteams: ['t2'] },
  { netid: 'design24', role: 'designer', subteams: ['t2'] }
] as const;

const devs = [
  { netid: 'dev1', role: 'developer', subteams: ['t1'] },
  { netid: 'dev2', role: 'developer', subteams: ['t1'] },
  { netid: 'dev3', role: 'developer', subteams: ['t2'] },
  { netid: 'dev4', role: 'developer', subteams: ['t2'] }
] as const;

const mockData: readonly SimplifiedMemberForTreeGeneration[] = [
  // Leads
  opsLead,
  productLead,
  businessLead,
  ...designLeads,
  ...devLeads,
  ...tpms,
  ...pms,
  ...business,
  ...designs,
  ...devs
];

it('treeifyIDOLMembers test', () => {
  expect(treeifyIDOLMembers(opsLead, mockData)).toEqual({
    member: { netid: 'ad665', role: 'lead', subteams: ['leads'] },
    children: [
      {
        member: { netid: 'acb352', role: 'lead', subteams: ['leads'] },
        children: [
          {
            member: { netid: 'pm1', role: 'pm', subteams: ['t1'] },
            children: [
              {
                children: [],
                member: {
                  netid: 'design1',
                  role: 'designer',
                  subteams: ['t1']
                }
              },
              {
                children: [],
                member: {
                  netid: 'design2',
                  role: 'designer',
                  subteams: ['t1']
                }
              }
            ]
          },
          {
            member: { netid: 'pm2', role: 'pm', subteams: ['t2'] },
            children: [
              {
                children: [],
                member: {
                  netid: 'design23',
                  role: 'designer',
                  subteams: ['t2']
                }
              },
              {
                children: [],
                member: {
                  netid: 'design24',
                  role: 'designer',
                  subteams: ['t2']
                }
              }
            ]
          }
        ]
      },
      {
        member: { netid: 'ete26', role: 'lead', subteams: ['leads'] },
        children: [
          {
            member: { netid: 'b1', role: 'business', subteams: ['business'] },
            children: []
          },
          {
            member: { netid: 'b2', role: 'business', subteams: ['business'] },
            children: []
          }
        ]
      },
      {
        member: { netid: 'ec592', role: 'lead', subteams: ['leads'] },
        children: []
      },
      {
        member: { netid: 'sy629', role: 'lead', subteams: ['leads'] },
        children: []
      },
      {
        member: { netid: 'my474', role: 'lead', subteams: ['leads'] },
        children: [
          {
            member: { netid: 'jb2375', role: 'lead', subteams: ['leads'] },
            children: [
              {
                member: { netid: 'cph64', role: 'lead', subteams: ['leads'] },
                children: [
                  {
                    member: { netid: 'tpm1', role: 'tpm', subteams: ['t1'] },
                    children: [
                      {
                        member: {
                          netid: 'dev1',
                          role: 'developer',
                          subteams: ['t1']
                        },
                        children: []
                      },
                      {
                        member: {
                          netid: 'dev2',
                          role: 'developer',
                          subteams: ['t1']
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    member: {
                      netid: 'tpm2',
                      role: 'tpm',
                      subteams: ['t2']
                    },
                    children: [
                      {
                        member: {
                          netid: 'dev3',
                          role: 'developer',
                          subteams: ['t2']
                        },
                        children: []
                      },
                      {
                        member: {
                          netid: 'dev4',
                          role: 'developer',
                          subteams: ['t2']
                        },
                        children: []
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  });
});

const getChain = (member: SimplifiedMemberForTreeGeneration) =>
  computeDTI48UpgradeChain(member.netid, mockData).map((it) => it.netid);

it('computeDTI48UpgradeChain lead chain test', () => {
  expect(getChain(opsLead)).toEqual([opsLead.netid]);
  designLeads.forEach((designLead) =>
    expect(getChain(designLead)).toEqual([designLead.netid, OPS_LEAD_NETID])
  );
  devLeads.forEach((devLead, index) => {
    expect(getChain(devLead)).toEqual([
      ...devLeads.slice(index).map((it) => it.netid),
      opsLead.netid
    ]);
  });
  expect(getChain(businessLead)).toEqual([BUSINESS_LEAD_NETID, OPS_LEAD_NETID]);
  expect(getChain(productLead)).toEqual([PRODUCT_LEAD_NETID, OPS_LEAD_NETID]);
});

it('computeDTI48UpgradeChain TPM/PM chain test', () => {
  tpms.forEach((tpm) =>
    expect(getChain(tpm)).toEqual([tpm.netid, ...DEV_LEAD_NETIDS, OPS_LEAD_NETID])
  );

  pms.forEach((pm) => expect(getChain(pm)).toEqual([pm.netid, PRODUCT_LEAD_NETID, OPS_LEAD_NETID]));
});

it('computeDTI48UpgradeChain Business chain test', () => {
  business.forEach((m) =>
    expect(getChain(m)).toEqual([m.netid, BUSINESS_LEAD_NETID, OPS_LEAD_NETID])
  );
});

it('computeDTI48UpgradeChain Design/Dev chain test', () => {
  designs.forEach((m) =>
    expect(getChain(m)).toEqual([
      m.netid,
      ...pms.filter((pm) => pm.subteams[0] === m.subteams[0]).map((pm) => pm.netid),
      PRODUCT_LEAD_NETID,
      OPS_LEAD_NETID
    ])
  );

  devs.forEach((m) =>
    expect(getChain(m)).toEqual([
      m.netid,
      ...tpms.filter((tpm) => tpm.subteams[0] === m.subteams[0]).map((tpm) => tpm.netid),
      ...DEV_LEAD_NETIDS,
      OPS_LEAD_NETID
    ])
  );
});
