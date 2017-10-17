# Bindo Merchant Dashboard #

### Prerequisites ###
1. Install node.js
2. Install bower `npm i --g bower`
4. Install shipit:  `npm i --g shipit-cli`
5. Install all local dependencies: `npm install` & `bower install`
6. Run `npm run start` and start developing Angular Side!
7. Run `npm run start2` and start developing React Side!


### Build ###
- `npm run stagingboth` to deploy to staging
- `npm run productionboth` to deploy to production


### Deployment ###

    
##### Staging
- https://[branch].d1.dashboard.trybindo.com/ -  `npm run stagingboth`
You will get real path display on the console after deploy.
Each Git branch will deploy to folder under its name, without it's prefix. e.g. **feature/DASHBOARD-100-awesome** will deploy to https://DASHBOARD-100-awesome.d1.dashboard.trybindo.com/



# Dashboard Development Workflow #

### TL;DR ###

All new **feature** branches should be created from `development` and **hotfix** branches should be created from `master`.

### Detailed Workflow ###

##### Workflow for feature branches

1. **Feature owner** create a ticket on JIRA
2. Developer use JIRA ticket's **create branch** to create feature branch from development branch, prefixed with **feature/**
3. When development is done, deploy to staging server (usally CI server will do it for you) and comment URL on JIRA ticket to let fetaure owner review it. (JIRA status **on staging**)
4. After fetaure owner confirm feature is done right, creat a pull request on bitbucket (JIRA status **In review**)
5. After peers approved your code, merge the pull request

##### Workflow for hotfix branches

1. Create new branch prefix with **hotfix/** from master branch
2. Do the fix.
3. Build and deploy to production
4. Merge branch back to **master** and **development** branch