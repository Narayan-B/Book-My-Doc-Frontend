const Footer = () => {
    return (
      <footer className="bg-blue-600 p-2 md:p-4 lg:p-6 mt-8">
        <div className="container mx-auto text-center text-white text-xs md:text-sm lg:text-base">
          <p>&copy; {new Date().getFullYear()} Book My Doc. All rights reserved.</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  