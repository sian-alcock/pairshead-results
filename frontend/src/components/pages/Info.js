import React from 'react'

class Info extends React.Component {


  render() {

    return (
      <section className="section">
        <div className="container">
          <div className="box">
            <p>Raw time - the raw time is the finish time less the start time</p>
            <p>Race time - the race time is the raw time plus any penalty</p>
            <p>Time - the Time column on the Results page presents the Override time plus any penalty or the race time (which already includes the penalty)</p>
          </div>
        </div>
      </section>
    )
  }
}

export default Info
