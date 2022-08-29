

const CreateClient = () => {
    return (
        <>
            <div className="create-client">
                <div className="create-client-left">
                    <div className="column">
                        <div className="create-client-inputs">
                            <label htmlFor="first-name" className='label'>First name</label>
                            <input type="text" id="first-name" />
                            <label htmlFor="last-name" className='label'>Last name</label>
                            <input type="text" id="last-name" />
                            <label htmlFor="date-of-birth" className='label'>Date of birth</label>
                            <input type="text" id="date-of-birth" />
                            <label htmlFor="country-name" className='label'>Country name</label>
                            <input type="text" id="country-name" />
                            <label htmlFor="country-code" className='label'>Country code</label>
                            <input type="text" id="country-code" />
                            <label htmlFor="street-name" className='label'>Street name</label>
                            <input type="text" id="street-name" />
                            <label htmlFor="house-number" className='label'>House number</label>
                            <input type="text" id="house-number" />
                            <label htmlFor="postal-code" className='label'>Postal code</label>
                            <input type="text" id="postal-code" />
                        </div>
                    </div>
                </div>
                <div className="create-client-right">
                    <div className="column">
                        <div className="create-client-inputs">
                            <label htmlFor="account-number" className='label'>Account number</label>
                            <input type="text" id="account-number" />
                            <label htmlFor="currency-name" className='label'>Currency name</label>
                            <input type="text" id="currency-name" />
                            <label htmlFor="currency-code" className='label'>Currency code</label>
                            <input type="text" id="currency-code" />
                            <label htmlFor="deposited-amount" className='label'>Deposited amount</label>
                            <input type="text" id="deposited-amount" />
                            <label htmlFor="type-of-customer" className='label'>Type of customer</label>
                            <input type="text" id="type-of-customer" />
                            <label htmlFor="type-of-account" className='label'>Type of account</label>
                            <input type="text" id="type-of-account" />
                            <label htmlFor="credit-payment" className='label'>Credit payment</label>
                            <input type="text" id="credit-payment" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateClient;