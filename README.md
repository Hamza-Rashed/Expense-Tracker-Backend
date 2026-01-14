create users with roles (admin, user) the admin can do anything but the user can do anything in his account only. We did that using the role based .. 

When the user login we generate a token and regresh token as well .. So the user can't login wuithout vailed token.

Each user has many categories .. The same user can't create the same category based on the name of the category.

Each category has many transations .. 

All user roles can create categories and transations and budgets .. Only admin can create user or delete or update it.

You can get all categories, category by id and categories by user id.

Only admin can list everything .. User can't list all users for example or all categories or all transations etc ...

Regarding Transatcion you can create a transaction for a user and for a category. You can list the transactions all of them for admin only and you can get the transactions using the category id for user id and you can get the transaction using Type and using MONTHLY Sullary and by date range.

