store = { jobs: [], user_jobs: [] }

jobId = 0

class Job {
  constructor(title, location, jobType, description, howToApply, company, companyUrl, companyLogo, apiId){
    this.id = ++jobId;
    this.apiId = apiId;
    this.title = title;
    this.location = location;
    this.jobType = jobType;
    this.howToApply = howToApply;
    this.description = description;
    this.company = company;
    this.companyUrl = companyUrl;
    this.companyLogo = companyLogo;
    store.jobs.push(this);
  }
}
