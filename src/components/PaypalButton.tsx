import { useEffect } from 'react';

export default function PaypalButton() {
  function addButtonScript() {
    const script = document.createElement('script');
    script.src =
      'https://www.paypal.com/sdk/js?client-id=AWrWqn0JHsqWvUwTxMbg9tjuzc2e2g38B6dpaQ9W2MJHUHYuXyqMbVInIKl78LGa4hDltILUHF115e76&vault=true&intent=subscription';
    script.setAttribute('data-sdk-integration-source', 'button-factory');
    script.onload = () => {
      window.paypal
        .Buttons({
          style: {
            shape: 'rect',
            color: 'gold',
            layout: 'horizontal',
            label: 'subscribe',
          },
          createSubscription(data, actions) {
            return actions.subscription.create({
              /* Creates the subscription */
              plan_id: 'P-5TS19965CY445213BMP3FU2I',
            });
          },
          onApprove(data, actions) {
            return new Promise(() => {
              alert(data.subscriptionID);
            }); // You can add optional success message for the subscriber here
          },
        })
        .render('#paypal-button-container-P-5TS19965CY445213BMP3FU2I'); // Renders the PayPal button
    };
    document.body.appendChild(script);
  }

  useEffect(() => {
    addButtonScript();
  }, []);

  return (
    <div id="paypal-button-container">
      <div id="paypal-button-container-P-5TS19965CY445213BMP3FU2I" />
    </div>
  );
}
