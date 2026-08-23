export const DEMO_ACCOUNTS = [
  {
    id: 'chef-ava',
    name: 'Chef Ava',
    role: 'admin',
    title: 'Kitchen Admin',
    avatar: '👩‍🍳',
    permissions: ['create', 'edit', 'delete', 'manage-categories'],
  },
  {
    id: 'sam-homecook',
    name: 'Sam HomeCook',
    role: 'contributor',
    title: 'Recipe Contributor',
    avatar: '🧑‍🍳',
    permissions: ['create', 'edit-own'],
  },
];

export const getDemoAccount = (id) =>
  DEMO_ACCOUNTS.find((account) => account.id === id) ?? DEMO_ACCOUNTS[0];
