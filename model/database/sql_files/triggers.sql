use db_dacs4;

DELIMITER $

CREATE TRIGGER generate_invite_codes
BEFORE INSERT ON classes
FOR EACH ROW
BEGIN
    SET NEW.invite_code_students = UUID();
END $

CREATE TRIGGER generate_meeting_invite_code
BEFORE INSERT ON meetings
FOR EACH ROW
BEGIN
    SET NEW.meeting_code = UUID();
END $

DELIMITER ;