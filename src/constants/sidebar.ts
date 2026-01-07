/** The options for the sidebar. */
export const options = [
  {
    children: [
      {
        key: '404',
        label: 'sidebar.404',
        withoutDashboard: true,
      },
      {
        key: '500',
        label: 'sidebar.500',
        withoutDashboard: true,
      },
      {
        key: 'signin',
        label: 'sidebar.signIn',
        withoutDashboard: true,
      },
      {
        key: 'signup',
        label: 'sidebar.signUp',
        withoutDashboard: true,
      },
      {
        key: 'forgotpassword',
        label: 'sidebar.forgotPw',
        withoutDashboard: true,
      },
      {
        key: 'resetpassword',
        label: 'sidebar.resetPw',
        withoutDashboard: true,
      },
    ],
    key: 'pages',
    label: 'sidebar.pages',
    leftIcon: 'ion-document-text',
  },
  {
    key: 'blank_page',
    label: 'sidebar.blankPage',
    leftIcon: 'ion-document',
  },
]
