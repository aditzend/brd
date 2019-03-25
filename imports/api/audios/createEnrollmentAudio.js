const sql = require("mssql");
const mssqlConfig = Meteor.settings.mssqlConfig;

export default function(
  CallID,
  RelativePath,
  UsedFor,
  RecordCount,
  BiometricProfile,
  Phrase,
  Challenge,
  ANI,
  Source,
  SourceVersion,
  CreatedAt,
  Transcription,
  PartOfSignatureId,
  IsPartOfSignature,
  AgentDocNumber,
  HasErrors,
  LengthError,
  NoiseError,
  ContentError,
  BiometricError
) {
  return new Promise((resolve, reject) => {
    sql.close();
    const query = `EXEC CreateEnrollmentAudio
    @CallID,
    @RelativePath,
    @UsedFor,
    @RecordCount,
    @BiometricProfile,
    @Phrase,
    @Challenge,
    @ANI,
    @Source,
    @SourceVersion,
    @Transcription,
    @PartOfSignatureId,
    @IsPartOfSignature,
    @AgentDocNumber,
    @HasErrors,
    @LengthError,
    @NoiseError,
    @ContentError,
    @BiometricError`
    sql.connect(mssqlConfig).then(pool => {
        return pool.request()
            .input('CallID', sql.VarChar(127), CallID)
            .input('RelativePath', sql.VarChar(255), RelativePath)
            .input('UsedFor', sql.VarChar(30), UsedFor)
            .input('RecordCount', sql.SmallInt, RecordCount)
            .input('BiometricProfile', sql.VarChar(20), BiometricProfile)
            .input('Phrase', sql.VarChar(120), Phrase)
            .input('Challenge', sql.VarChar(60), Challenge)
            .input('ANI', sql.VarChar(20), ANI)
            .input('Source', sql.VarChar(20), Source)
            .input('SourceVersion', sql.VarChar(10), SourceVersion)
            .input('Transcription', sql.VarChar(120), Transcription)
            .input('PartOfSignatureId', sql.VarChar(12), PartOfSignatureId)
            .input('IsPartOfSignature', sql.Bit, IsPartOfSignature)
            .input('AgentDocNumber', sql.VarChar(12), AgentDocNumber)
            .input('HasErrors', sql.Bit, HasErrors)
            .input('LengthError', sql.Bit, LengthError)
            .input('NoiseError', sql.VarChar(127), NoiseError)
            .input('ContentError', sql.VarChar(127), ContentError)
            .input('BiometricError', sql.VarChar(127), BiometricError)
            .query(query)
    }).then(result => resolve({success: true, message: result}))
    .catch(err => {
        resolve({success: false, message: err.originalError.info.message})
    })
  });
}
