import React, { useState, useEffect } from 'react';
import './user.css';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import GroupList from './GroupList';
import ReviewList from './ReviewList';
import ProfileEdit from './ProfileEdit'; 
import SimpleDateTime from 'react-simple-timestamp-to-date';

const ProfileDetails = ({ user }) => {
    const [profile, setProfile] = useState(null);
    const { profilename } = useParams();
    const [editMode, setEditMode] = useState(false); 
    const [isOwnProfile, setOwnProfile] = useState(false);
    const [isPrivate, setPrivate] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };
    
                const response = await axios.get(`http://localhost:3001/profile/${profilename}`, { headers });
    
                console.log("Token from sessionStorage:", token);
                console.log("Profilename from token:", profilename);
                console.log("Response from profile:", response.data);
    
                setProfile(response.data);
                setOwnProfile(response.data.isOwnProfile);
                setPrivate(response.data.is_private);


            } catch (error) {
                console.error('Virhe haettaessa profiilitietoja:', error);
            }
        };
    
        fetchProfile();
    }, [profilename]);

    const handleEditClick = () => {
        setEditMode(true); 
    };

    return (
        <div className="content">
            <div className="inner-view">
                <div className="inner-left">
                    <img src={profile?.profilepicurl || ''} className="profilepic" alt="Käyttäjän kuva" />
                    {!isPrivate && <p>Viimeksi kirjautunut <br></br><DatabaseDateTime /></p>}
                    {(isOwnProfile && !editMode) && <button onClick={handleEditClick} className="basicbutton">Muokkaa profiilia</button>}
                </div>

                <div className="inner-right">
                    <h2>{profile?.profilename}</h2>
                    <ul>
                        {(!isPrivate  || isOwnProfile) && <p className="info">{profile?.description || ''} </p>}
                        {isPrivate && !isOwnProfile && <span className="userinfo">Tämä profiili on yksityinen.</span>}
                    </ul>
                </div>
            </div>
           
            {editMode && <ProfileEdit profilename={profilename} />}

            {(!isPrivate || isOwnProfile) && (
                <div className="three-view">
                    <div className="three-left">
                        <h2>Suosikit &nbsp;<span className='emoji uni10'></span></h2>
                        <ul>
                            <li><span className='userinfo'>Ei vielä suosikkeja</span></li>
                        </ul>
                    </div>

                    <div className="three-middle">
                        <h2>Ryhmät &nbsp;<span className='emoji uni07'></span></h2>  
                        <GroupList profile={profile} />
                    </div>

                    <div className="three-right">
                        <h2>Arvostelut  &nbsp;<span className='emoji uni08'></span></h2>
                        <ReviewList profile={profile}/>
                    </div>
                </div>
            )}
        </div>
    );
    
};

// viimeksi kirjautunu
const DatabaseDateTime = () => {
    const [dateTimeFromDatabase, setDateTimeFromDatabase] = useState('');
    const { profilename } = useParams();
    useEffect(() => {
        const fetchDateTimeFromDatabase = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/profile/${profilename}`);
                const data = response.data;
                console.log("Tietokannasta saatu timestamp:", data); 
                setDateTimeFromDatabase(data.timestamp);
            } catch (error) {
                console.error('Virhe haettaessa päivämäärää ja aikaa tietokannasta:', error);
            }
        };

        fetchDateTimeFromDatabase();
    }, []);

    return (
        <SimpleDateTime dateSeparator="-" timeSeparator=":">
            {dateTimeFromDatabase}
        </SimpleDateTime>
    );
};
export default ProfileDetails;
