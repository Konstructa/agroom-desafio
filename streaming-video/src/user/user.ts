const users: any[] = [];

const userJoin = (id: number, username: string, room: number, host: number) => {
  const user = { id, username, room, host };

  users.push(user);
  return user;
};

export default { userJoin };
