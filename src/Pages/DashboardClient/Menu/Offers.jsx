import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardMedia, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useTranslation } from 'react-i18next';
import ProductDetails from './ProductDetails/ProductDetails';
import { BASE_URL_IMG } from "../../../utils/constants"

const OfferCard = ({ offer, onClick }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        cursor: 'pointer',
        display: 'flex',
        width: '88%',
        borderRadius: '0px 10px 10px 10px',
        padding: '10px',
        alignItems: 'center',
        maxWidth: 340,
        position: 'relative',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        overflow: 'visible',
        marginTop: '30px',
      }}
      onClick={() => onClick(offer)} // تمرير بيانات العرض عند النقر
    >
      <Box
        sx={{
          backgroundColor: theme.palette.secondaryColor.main,
          color: 'white',
          padding: '15px',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          zIndex: 1,
        }}
      >
        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>
          {offer.discount}
        </Typography>
      </Box>
      <CardMedia
        component='img'
        image={`${BASE_URL_IMG}${offer.img}`}
        alt={offer.name}
        sx={{
          width: 100,
          height: 100,
          borderRadius: '10px',
          objectFit: 'cover',
        }}
      />
      <Box sx={{ flex: 1, padding: '0px 10px', marginTop: '10px' }}>
        <Typography
          variant='h1'
          sx={{ fontSize: '12px', fontWeight: '900', color: '#575756' }}
        >
          {offer.name}
        </Typography>
        <Typography
          variant='body2'
          color='textSecondary'
          sx={{ fontSize: '9px', mb: 1, marginTop: '5px' }}
        >
          {offer.description}
        </Typography>
        <Box sx={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography
              variant='h6'
              sx={{
                color: 'gray',
                padding: '0',
                fontSize: '9px',
                textDecoration: 'line-through',
              }}
            >
              <span
                style={{
                  color: theme.palette.orangePrimary.main,
                  fontWeight: 'bold',
                  fontSize: '10px',
                }}
              >
                {offer.before_discount}
              </span>{' '}
              <span>EGP</span>
            </Typography>
            <Typography
              variant='h6'
              sx={{
                fontSize: '15px',
                fontWeight: 'bold',
                color: theme.palette.orangePrimary.main,
              }}
            >
              {offer.after_discount}{' '}
              <span style={{ color: 'gray', fontSize: '8px' }}>EGP</span>
            </Typography>
          </Box>
          <Box
            sx={{
              width: '10px',
              height: '10px',
              backgroundColor: theme.palette.orangePrimary.main,
              color: 'white',
              borderRadius: '50%',
              padding: '6px',
              marginTop: '10px',
              display: 'flex',
              cursor: 'pointer',
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <AddIcon sx={{ fontSize: '13px' }} />
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

const Offers = ({ isItemSelected, offers, setSelectedItem ,selectedItem, cartCount, setCartCount, activeItemId, setActiveItemId, isCartOpen, toggleCart, handleSizeClick, selectedSize, handleOptionClick, selectedItemOptions, handleExtraClick, selectedItemExtra }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [activeSlide, setActiveSlide] = useState(0);

  const handleOfferClick = (offer) => {
    setSelectedItem({...offer,special:offer}); // تحديث العرض المختار
    setActiveItemId(offer.id === activeItemId ? null : offer.id); // تحديث المعرف النشط
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: offers.length <= 1 ? 1 : isItemSelected ? 3 : 4,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (current, next) => setActiveSlide(next),
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: Math.min(offers.length, isItemSelected ? 3 : 4),
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(offers.length, 3),
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: Math.min(offers.length, 2),
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
    appendDots: (dots) => (
      <div>
        <ul
          style={{
            margin: '0px',
            padding: '0px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {dots.slice(0, 3)}
        </ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={{
          width: '9px',
          height: '9px',
          borderRadius: '50%',
          backgroundColor: i === activeSlide ? theme.palette.orangePrimary.main : '#d3d3d3',
          margin: '15px 0px',
          cursor: 'pointer',
        }}
      />
    ),
  };

  return (
    <Box
      sx={{
        padding: '0px 15px',
        marginTop: '15px',
        width: isItemSelected ? '75%' : '100%',
        transition: 'width 0.1s ease',
        position: 'relative',
        left: '2%',
      }}
    >
      <Typography
        variant='h5'
        sx={{
          fontSize: '15px',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: theme.palette.text.gray_white,
        }}
      >
        <span style={{ padding: '2px 0px', borderBottom: '2px solid #ef7d00' }}>
          {t('special')}
        </span>{' '}
        {t('offers')}
      </Typography>
      {offers.length === 0 ? (
        <Typography sx={{ color: theme.palette.text.gray_white }}>
          {t('no_offers_available')}
        </Typography>
      ) : offers.length > 1 ? (
        <Slider {...settings} >
          {offers.map((offer) => (
            <Box key={offer.id} sx={{ height: '150px' }} >
              <OfferCard offer={offer} onClick={handleOfferClick} />
            </Box>
          ))}
        </Slider>
      ) : (
        <Box sx={{ height: '150px' }}>
          <OfferCard offer={offers[0]} onClick={handleOfferClick} />
        </Box>
      )}

      {selectedItem && (
        <Box
          sx={{ transition: 'width 0.3s ease', paddingLeft: '16px' }}
          onClick={(e) => e.stopPropagation()}
        >
          <ProductDetails
            item={selectedItem}
            cartCount={cartCount}
            setCartCount={setCartCount}
            activeItemId={activeItemId}
            isCartOpen={isCartOpen}
            toggleCart={toggleCart}
            handleSizeClick={handleSizeClick}
            selectedSize={selectedSize}
            handleOptionClick={handleOptionClick}
            selectedItemOptions={selectedItemOptions}
            handleExtraClick={handleExtraClick}
            selectedItemExtra={selectedItemExtra}
            onClose={() => setSelectedItem(null)}
          />
        </Box>
      )}
    </Box>
  );
};

export default Offers;