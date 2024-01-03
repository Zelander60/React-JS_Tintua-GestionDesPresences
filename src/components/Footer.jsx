import React from 'react';

function getDate() {
  const today = new Date();
  // const month = today.getMonth() + 1;
  const year = today.getFullYear();
  // const date = today.getDate();
  return year;
}

const Footer = () => (
  <div className="mt-24">
    <p className="dark:text-gray-200 text-gray-700 text-center m-20">
      © {getDate()} Tous Droits Réservés ONG TINTUA
    </p>
  </div>
);

export default Footer;
