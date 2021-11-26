import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSortUp, BsSortUpAlt} from 'react-icons/bs'
import EachRow from '../EachRow'
import Footer from '../Footer'
import './index.css'

const statesList = [
  {
    state_code: 'AN',
    state_name: 'Andaman and Nicobar Islands',
  },
  {
    state_code: 'AP',
    state_name: 'Andhra Pradesh',
  },
  {
    state_code: 'AR',
    state_name: 'Arunachal Pradesh',
  },
  {
    state_code: 'AS',
    state_name: 'Assam',
  },
  {
    state_code: 'BR',
    state_name: 'Bihar',
  },
  {
    state_code: 'CH',
    state_name: 'Chandigarh',
  },
  {
    state_code: 'CT',
    state_name: 'Chhattisgarh',
  },
  {
    state_code: 'DN',
    state_name: 'Dadra and Nagar Haveli and Daman and Diu',
  },
  {
    state_code: 'DL',
    state_name: 'Delhi',
  },
  {
    state_code: 'GA',
    state_name: 'Goa',
  },
  {
    state_code: 'GJ',
    state_name: 'Gujarat',
  },
  {
    state_code: 'HR',
    state_name: 'Haryana',
  },
  {
    state_code: 'HP',
    state_name: 'Himachal Pradesh',
  },
  {
    state_code: 'JK',
    state_name: 'Jammu and Kashmir',
  },
  {
    state_code: 'JH',
    state_name: 'Jharkhand',
  },
  {
    state_code: 'KA',
    state_name: 'Karnataka',
  },
  {
    state_code: 'KL',
    state_name: 'Kerala',
  },
  {
    state_code: 'LA',
    state_name: 'Ladakh',
  },
  {
    state_code: 'LD',
    state_name: 'Lakshadweep',
  },
  {
    state_code: 'MH',
    state_name: 'Maharashtra',
  },
  {
    state_code: 'MP',
    state_name: 'Madhya Pradesh',
  },
  {
    state_code: 'MN',
    state_name: 'Manipur',
  },
  {
    state_code: 'ML',
    state_name: 'Meghalaya',
  },
  {
    state_code: 'MZ',
    state_name: 'Mizoram',
  },
  {
    state_code: 'NL',
    state_name: 'Nagaland',
  },
  {
    state_code: 'OR',
    state_name: 'Odisha',
  },
  {
    state_code: 'PY',
    state_name: 'Puducherry',
  },
  {
    state_code: 'PB',
    state_name: 'Punjab',
  },
  {
    state_code: 'RJ',
    state_name: 'Rajasthan',
  },
  {
    state_code: 'SK',
    state_name: 'Sikkim',
  },
  {
    state_code: 'TN',
    state_name: 'Tamil Nadu',
  },
  {
    state_code: 'TG',
    state_name: 'Telangana',
  },
  {
    state_code: 'TR',
    state_name: 'Tripura',
  },
  {
    state_code: 'UP',
    state_name: 'Uttar Pradesh',
  },
  {
    state_code: 'UT',
    state_name: 'Uttarakhand',
  },
  {
    state_code: 'WB',
    state_name: 'West Bengal',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    resultList: [],
    apiStatus: apiStatusConstants.initial,
    activeStateNameDetails: '',
  }

  componentDidMount() {
    this.getAllStatesCovidCases()
  }

  convertObjectsDataIntoListItemsUsingForInMethod = data => {
    const resultList = []
    const keyNames = Object.keys(data)
    keyNames.forEach(keyName => {
      if (data[keyName]) {
        const {total} = data[keyName]
        const confirmed = total.confirmed ? total.confirmed : 0
        const deceased = total.deceased ? total.deceased : 0
        const recovered = total.recovered ? total.recovered : 0
        const tested = total.tested ? total.tested : 0
        const population = data[keyName].meta.population
          ? data[keyName].meta.population
          : 0
        const stateName = [
          statesList.find(state => state.state_code === keyName),
        ]
        resultList.push({
          stateCode: keyName,
          confirmed,
          name: stateName[0],
          deceased,
          recovered,
          tested,
          population,
          active: confirmed - (deceased + recovered),
        })
      }
    })
    return resultList
  }

  getAllStatesCovidCases = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const response = await fetch('https://apis.ccbp.in/covid19-state-wise-data')
    if (response.ok === true) {
      const data = await response.json()
      const updatedList = this.convertObjectsDataIntoListItemsUsingForInMethod(
        data,
      )
      this.setState({
        resultList: updatedList,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickEachState = (event, details) => {
    event.preventDefault()
    this.setState({activeStateNameDetails: details})
  }

  renderTable = () => {
    const {resultList} = this.state
    return (
      <tbody>
        {resultList.map(each => (
          <EachRow
            key={each.stateCode}
            details={each}
            onClickEachState={this.onClickEachState}
          />
        ))}
      </tbody>
    )
  }

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="Oval" color="#007bff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="fail-image"
      />
      <p>Oops! Something Went Wrong</p>
      <button
        className="retry-btn"
        type="button"
        onClick={this.getAllStatesCovidCases}
      >
        Retry
      </button>
    </div>
  )

  renderTableView = () => (
    <div className="table-design">
      <table className="users_table">
        <thead className="thead">
          <tr>
            <th>
              <div className="sort-sec">
                <p>States/UT</p>
                <BsSortUpAlt className="sort-icon" />
                <BsSortUp className="sort-icon" />
              </div>
            </th>
            <th>Confirmed</th>
            <th>Active</th>
            <th>Recovered</th>
            <th>Deceased</th>
            <th>Population</th>
          </tr>
        </thead>
        {this.renderTable()}
      </table>
    </div>
  )

  renderAll = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderTableView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <div className="home-bg">
          <div>
            <input type="search" placeholder="Search" className="search-box" />
          </div>
          <div className="home-icons-section">
            <div className="section1">
              <div className="confirmed">
                <p>Confirmed</p>
                <img
                  src="https://res.cloudinary.com/dbphffmis/image/upload/v1637413101/Group_rtygto.png"
                  alt="cofirmed"
                  className="confirmed-image"
                />
                <p>12325</p>
              </div>
              <div className="active">
                <p>Active</p>
                <img
                  src="https://res.cloudinary.com/dbphffmis/image/upload/v1637413101/protection_1_btp8wk.png"
                  alt="active"
                  className="confirmed-image"
                />
                <p>12325</p>
              </div>
            </div>
            <div className="section1">
              <div className="recovered">
                <p>Recovered</p>
                <img
                  src="https://res.cloudinary.com/dbphffmis/image/upload/v1637413101/recovered_1_mnz2xy.png"
                  alt="recovered"
                  className="confirmed-image"
                />
                <p>12325</p>
              </div>
              <div className="deceased">
                <p>Deceased</p>
                <img
                  src="https://res.cloudinary.com/dbphffmis/image/upload/v1637413101/Outline_fqrmo2.png"
                  alt="deceased"
                  className="confirmed-image"
                />
                <p>12325</p>
              </div>
            </div>
          </div>
          {this.renderAll()}
        </div>
        <Footer />
      </>
    )
  }
}

export default Home
