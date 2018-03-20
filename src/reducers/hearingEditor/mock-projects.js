const mockProjects = [
  {
    id: "project 1",
    identifier: null,
    title: {
      en: 'test project 1',
      sv: 'DOGE'
    },
    phases: [
      {
        id: 'project 1 - phase 1',
        has_hearings: false,
        ordering: 1,
        title: {
          en: 'Phase 1'
        },
        description: {
          en: 'description of stupidity muahahaha'
        },
        schedule: {
          en: 'no idea what data type is this keke'
        }
      }
    ]
  },
  {
    id: "project 2",
    identifier: null,
    title: {
      en: 'test project 2',
      fi: 'wow'
    },
    phases: [
      {
        id: 'project 2 - phase 1',
        has_hearings: false,
        ordering: 1,
        title: {
          en: 'Phase 1',
          fi: 'phase 1 in finnish'
        },
        description: {
          en: 'description of stupidity',
          fi: 'phase 1 description in finnish'
        },
        schedule: {
          en: 'no idea what data type is this',
          fi: 'phase 1 schedule in finnish'
        }
      },
      {
        id: 'project 2 - phase 2',
        has_hearings: false,
        ordering: 2,
        title: {
          en: 'Phase 2'
        },
        description: {
          en: 'description of stupidity janis joplin is god'
        },
        schedule: {
          en: 'no idea what data type is this'
        }
      },
      {
        id: 'project 2 - phase 3',
        has_hearings: true,
        ordering: 3,
        title: {
          en: 'Phase 1'
        },
        description: {
          en: 'an amazing description of stupidity'
        },
        schedule: {
          en: 'no idea what data type is this what the hecking blooding hell'
        }
      }
    ]
  },
  {
    id: "project 3",
    identifier: null,
    title: {
      en: 'test project 3'
    },
    phases: [
      {
        id: 'project 3 - phase 1',
        has_hearings: true,
        ordering: 1,
        title: {
          en: 'Phase 1'
        },
        description: {
          en: 'this description is not so stupid'
        },
        schedule: {
          en: 'no idea what data type is this'
        }
      },
      {
        id: 'project 3 - phase 2',
        has_hearings: false,
        ordering: 2,
        title: {
          en: 'Phase 2'
        },
        description: {
          en: 'description of stupidity'
        },
        schedule: {
          en: 'no idea what data type is this'
        }
      }
    ]
  }
];

export default mockProjects;
