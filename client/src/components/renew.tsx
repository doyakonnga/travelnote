
'use client'

const Renew = () => {
  fetch('/api/v1/user/renewtoken').then().catch(()=>{})
  return (<></>)
}

export default Renew
