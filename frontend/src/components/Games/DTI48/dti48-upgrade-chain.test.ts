import computeDTI48UpgradeChain, {
  treeifyIDOLMembers,
  SimplifiedMemberForTreeGeneration
} from './dti48-upgrade-chain';

const PRODUCT_LEAD_NETID = 'product-lead-id';
const BUSINESS_LEAD_NETID = 'business-lead-id';
const DEV_LEAD_NETIDS = ['dev-lead-id-1', 'dev-lead-id-2', 'dev-lead-id-3'];
const DESIGN_LEAD_NETIDS = ['design-lead-id-1', 'design-lead-id-2'];
const OPS_LEAD_NETID = 'ops-lead-id';

const opsLead = {
  netid: OPS_LEAD_NETID,
  role: 'lead',
  subteams: ['leads', 'ops-leads']
} as const;

const productLead = {
  netid: PRODUCT_LEAD_NETID,
  role: 'lead',
  subteams: ['leads', 'product-leads']
} as const;

const businessLead = {
  netid: BUSINESS_LEAD_NETID,
  role: 'lead',
  subteams: ['leads', 'business-leads']
} as const;

const designLeads = DESIGN_LEAD_NETIDS.map(
  (netid) =>
    ({
      netid,
      role: 'lead',
      subteams: ['leads', 'design-leads']
    } as const)
);

const devLeads = DEV_LEAD_NETIDS.map(
  (netid) =>
    ({
      netid,
      role: 'lead',
      subteams: ['leads', 'dev-leads']
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
    member: { netid: OPS_LEAD_NETID, role: 'lead', subteams: ['leads', 'ops-leads'] },
    children: [
      {
        member: { netid: PRODUCT_LEAD_NETID, role: 'lead', subteams: ['leads', 'product-leads'] },
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
        member: { netid: BUSINESS_LEAD_NETID, role: 'lead', subteams: ['leads', 'business-leads'] },
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
        member: { netid: DESIGN_LEAD_NETIDS[0], role: 'lead', subteams: ['leads', 'design-leads'] },
        children: []
      },
      {
        member: { netid: DESIGN_LEAD_NETIDS[1], role: 'lead', subteams: ['leads', 'design-leads'] },
        children: []
      },
      {
        member: { netid: DEV_LEAD_NETIDS[2], role: 'lead', subteams: ['leads', 'dev-leads'] },
        children: [
          {
            member: { netid: DEV_LEAD_NETIDS[1], role: 'lead', subteams: ['leads', 'dev-leads'] },
            children: [
              {
                member: {
                  netid: DEV_LEAD_NETIDS[0],
                  role: 'lead',
                  subteams: ['leads', 'dev-leads']
                },
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
