const DonationPage = () => {
  return (
    <form action="https://www.paypal.com/donate" method="post" target="_blank">
      <input type="hidden" name="hosted_button_id" value="UDND2BZZ3D4TU" />
      <input
        type="image"
        src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"
        name="submit"
        title="PayPal - The safer, easier way to pay online!"
        alt="Donate with PayPal button"
      />
      <img
        alt=""
        src="https://www.paypal.com/en_MX/i/scr/pixel.gif"
        width="1"
        height="1"
      />
    </form>
  );
};

export default DonationPage;
