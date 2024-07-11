import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment-timezone'; 
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Set default timezone to Indian Standard Time (IST)
moment.tz.setDefault('Asia/Kolkata');

const appointmentSchema = Yup.object().shape({
  patientDetails: Yup.object().shape({
    name: Yup.string().required('Patient name is required'),
    age: Yup.number().typeError('Age must be a number').required('Patient age is required'),
    gender: Yup.string().required('Patient gender is required'),
    weight: Yup.number().typeError('Weight must be a number').required('Patient weight is required'),
    mobile: Yup.number().typeError('Mobile should be a number').required('Patient mobile is required'),
    address: Yup.string().required('Patient address is required'),
  }),
  appointmentDate: Yup.date().typeError('Appointment date should a valid date').required('Booking date is required'),
  selectedSlot: Yup.string().required('Slot is required'),
});

export default function BookAppointment() {
  const { id } = useParams();
  const [slots, setSlots] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');

  const [formData, setFormData] = useState({
    patientDetails: {
      name: '',
      age: '',
      gender: '',
      weight: '',
      mobile: '',
      address: '',
    },
    appointmentDate: '',
    selectedSlot: '',
  });
  
  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState({});

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/api/slots/${id}`, {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        });
        setSlots(response.data.slots);

        // Extract unique dates when the doctor is available
        const uniqueDates = response.data.slots.map(slot => ({
          date: slot.date,
          timeSlots: slot.timeSlots
        }));
        setAvailableDates(uniqueDates);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSlots();
  }, [id]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFormData({ ...formData, appointmentDate: date });
  
    // Find slots for the selected date
    const selectedDateStr = moment(date).format('YYYY-MM-DD');
    const selectedSlots = availableDates.find(slot => moment(slot.date).format('YYYY-MM-DD') === selectedDateStr);
    setFilteredSlots(selectedSlots ? selectedSlots.timeSlots : []);
    setSelectedSlot('');
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setFormData({ ...formData, selectedSlot: slot });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prevState) => ({
        ...prevState,
        [parent]: { ...prevState[parent], [child]: value },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await appointmentSchema.validate(formData, { abortEarly: false });
      setErrors({});
      setServerErrors({});
      const response = await axios.post(`http://localhost:5555/api/appointment-booking/${id}`, formData, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      //console.log('Appointment created:', response.data);

      setFormData({
        patientDetails: {
          name: '',
          age: '',
          gender: '',
          weight: '',
          mobile: '',
          address: '',
        },
        appointmentDate: '',
        selectedSlot: '',
      });

      toast.success('Appointment booked successfully!', {
        autoClose: 3000
      });

    } catch (err) {
      if (err.name === 'ValidationError') {
        const validationErrors = err.inner.reduce((acc, error) => {
          acc[error.path] = error.message;
          return acc;
        }, {});
        setErrors(validationErrors);
      } else if (err.response && err.response.data && err.response.data.errors) {
        const serverValidationErrors = err.response.data.errors.reduce((acc, error) => {
          acc[error.path] = error.msg;
          return acc;
        }, {});
        setServerErrors(serverValidationErrors);
      }
    }
  };

  const filterDates = (date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    return availableDates.some(slot => moment(slot.date).format('YYYY-MM-DD') === formattedDate);
  };
  
  return (
    <div className='col-md-4'>
      <h1>Book Appointment</h1>
      <form onSubmit={handleSubmit}>
          <label htmlFor="patientName">Patient Name</label>
          <input
            type="text"
            name="patientDetails.name"
            id="patientName"
            value={formData.patientDetails.name}
            onChange={handleChange}
            className="form-control"
          />
          {errors['patientDetails.name'] && <span className="text-danger">{errors['patientDetails.name']}</span>}
          {serverErrors['patientDetails.name'] && <span className="text-danger">{serverErrors['patientDetails.name']}</span>}

          <label htmlFor="patientAge">Patient Age</label>
          <input
            type="text"
            name="patientDetails.age"
            id="patientAge"
            value={formData.patientDetails.age}
            onChange={handleChange}
            className="form-control"
          />
          {errors['patientDetails.age'] && <span className="text-danger">{errors['patientDetails.age']}</span>}
          {serverErrors['patientDetails.age'] && <span className="text-danger">{serverErrors['patientDetails.age']}</span>}
       
          <label htmlFor="patientGender">Patient Gender</label>
          <select
            name="patientDetails.gender"
            id="patientGender"
            value={formData.patientDetails.gender}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors['patientDetails.gender'] && <span className="text-danger">{errors['patientDetails.gender']}</span>}
          {serverErrors['patientDetails.gender'] && <span className="text-danger">{serverErrors['patientDetails.gender']}</span>}
       
          <label htmlFor="patientWeight">Patient Weight</label>
          <input
            type="number"
            name="patientDetails.weight"
            id="patientWeight"
            value={formData.patientDetails.weight}
            onChange={handleChange}
            className="form-control"
          />
          {errors['patientDetails.weight'] && <span className="text-danger">{errors['patientDetails.weight']}</span>}
          {serverErrors['patientDetails.weight'] && <span className="text-danger">{serverErrors['patientDetails.weight']}</span>}
        
          <label htmlFor="patientMobile">Patient Mobile</label>
          <input
            type="number"
            name="patientDetails.mobile"
            id="patientMobile"
            value={formData.patientDetails.mobile}
            onChange={handleChange}
            className="form-control"
          />
          {errors['patientDetails.mobile'] && <span className="text-danger">{errors['patientDetails.mobile']}</span>}
          {serverErrors['patientDetails.mobile'] && <span className="text-danger">{serverErrors['patientDetails.mobile']}</span>}
        
          <label htmlFor="patientAddress">Patient Address</label>
          <input
            type="text"
            name="patientDetails.address"
            id="patientAddress"
            value={formData.patientDetails.address}
            onChange={handleChange}
            className="form-control"
          />
          {errors['patientDetails.address'] && <span className="text-danger">{errors['patientDetails.address']}</span>}
          {serverErrors['patientDetails.address'] && <span className="text-danger">{serverErrors['patientDetails.address']}</span>}
        
          <label htmlFor="appointmentDate">Appointment Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            className="form-control mb-3"
            dateFormat="yyyy-MM-dd"
            placeholderText="Select a date with available slots"
            filterDate={filterDates}
            minDate={new Date()} 
          />
          {errors.appointmentDate && <span className="text-danger">{errors.appointmentDate}</span>}
          {serverErrors.appointmentDate && <span className="text-danger">{serverErrors.appointmentDate}</span>}
        
          <label htmlFor="appointmentSlot">Available Slots</label>
          <div className="d-flex flex-wrap">
            {filteredSlots.map((slot, index) => (
              <button
                key={index}
                className={`btn m-1 ${selectedSlot === slot ? "btn-success" : "btn-secondary"}`}
                onClick={() => handleSlotSelect(slot)}
                disabled={!selectedDate} 
              >
                {slot}
              </button>
            ))}
          </div>
          {errors.selectedSlot && <span className="text-danger">{errors.selectedSlot}</span>}
          {serverErrors.selectedSlot && <span className="text-danger">{serverErrors.selectedSlot}</span>}
       
        <button type="submit" className="btn btn-primary">Book Appointment</button>
      </form>
    </div>
  );
}
