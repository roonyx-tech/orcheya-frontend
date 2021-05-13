export const ENGLISH_LEVELS_AMOUNT = 7;
export const EVENT_COLORS = {
  common: '#BED3FF',
  holiday: '#FC5600',
  vacation: '#EBFCFF',
  project: {
    paid: '#E3FFBF',
    unpaid: '#FFEFB8'
  },
};

export const EVENT_COLORS_BORDER = {
  common: '#94B7FF',
  holiday: '#D34800',
  vacation: '#3BE5FC',
  project: {
    paid: '#D0FF93',
    unpaid: '#FFE48A'
  },
};

export const EVENT_TYPES = {
  common: 'Event',
  holiday: 'Holiday',
  vacation: 'Vacation',
  project: 'Project',
};

export const eventBGColor = (event: any, type?: string): string => {
  const style = type ? EVENT_COLORS_BORDER : EVENT_COLORS;
  if (event.type === 'project') {
    return event.project.paid ? style.project.paid : style.project.unpaid;
  } else {
    return style[event.type] || style.common;
  }
};

export const PRODUCTION_MENU = [
  {
    name: 'Home',
    single: true,
    icon: 'fa-home',
    link: ['/dashboard'],
  },
  {
    name: 'Your team',
    single: true,
    icon: 'fa-users',
    link: ['/users-list'],
  },
  {
    name: 'Calendars',
    single: true,
    icon: 'fa-calendar',
    link: ['/calendar'],
  },
  {
    name: 'Reports',
    single: false,
    icon: 'fa-file-text',
    items: [
      { name: 'Timesheet', link: ['/reports/timesheet'] },
      { name: 'Updates', link: ['/updates'] },
    ]
  },
  {
    name: 'Admin',
    icon: 'fa-user-secret',
    single: false,
    items: [
      { name: 'Users', link: ['/admin', 'users'], permissions: 'users:crud' },
      { name: 'Skills', link: ['/admin', 'skills'], permissions: 'admin:skills' },
      { name: 'Achievements', link: ['/admin', 'achievements'], permissions: 'admin:achievements' },
      { name: 'Roles', link: ['/admin', 'roles'], permissions: 'admin:roles' },
      { name: 'FAQ', link: ['/admin', 'faq'], permissions: 'admin:faq' },
    ]
  },
];

export const OWNER = 'vladimir@roonyx.tech';
