# Lessons

Visit <a href="https://lessons.church/">https://lessons.church/</a> to learn more.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
#### Join us on [Slack](https://join.slack.com/t/livechurchsolutions/shared_invite/zt-i88etpo5-ZZhYsQwQLVclW12DKtVflg).

### Depends on
* [AccessApi](https://github.com/LiveChurchSolutions/AccessApi)
* [LessonsApi](https://github.com/LiveChurchSolutions/LessonsApi)

### Dev Setup Instructions
For the APIs, you may either set them up on your local machine first, or point to the staging server copies during development.  The staging server urls are in the sample dotenv files.

#### LessonsApp 
1. Copy `dotenv.sample.txt` to `.env` and updated it to point to the appropriate API urls. 
2. Pull the [appBase](https://github.com/LiveChurchSolutions/AppBase) submodule with: `git submodule init && git submodule update`
3. Install the dependencies with: `npm install`
4. run `npm start` to launch the project.
