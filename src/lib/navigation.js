export const navigateUser = (router, usecase, usertype) => {
  const routes = {
    admin: {
      home: "/admin", // Admin homepage
      logout: "/", // Redirect to main page
    },
    lecturer: {
      home: "/teacher", // Teacher homepage
      logout: "/", // Redirect to main page
    },
    student: {
      home: "/student", // Student homepage
      logout: "/", // Redirect to main page
    },
  };

  if (!routes[usertype]) {
    console.error("Invalid usertype");
    return;
  }

  const route = routes[usertype][usecase];
  if (route) {
    router.push(route);
  } else {
    console.error("Invalid usecase");
  }
};
